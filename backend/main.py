# backend/main.py

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_restx import Api, Namespace, Resource, fields, reqparse
import json
import os
import logging
from datetime import datetime, timedelta
import google.generativeai as genai
import traceback
import uuid
import time
import hashlib
from dotenv import load_dotenv

# Enhanced Analytics Imports
import statistics
from collections import defaultdict
try:
    import numpy as np
except ImportError:
    # Fallback for basic statistics without numpy
    np = None

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app and config
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# Enable CORS for frontend integration
CORS(app, origins=[
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:3001", "http://127.0.0.1:3001"
], allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Setup Flask-RESTX Api with Swagger
api = Api(app, version='1.0', title='AI Finance Assistant API',
          description='API documentation for AI Finance Assistant backend', doc='/docs')

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
model = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    try:
        models = genai.list_models()
        available_models = [m.name for m in models]
        logger.info(f"Available Gemini models: {available_models}")
        
        # Prefer models in order of preference (higher per-minute quota first)
        preferred_models = [
            'models/gemini-1.5-flash',
            'models/gemini-1.5-flash-latest',
            'models/gemini-1.5-flash-002',
            'models/gemini-1.5-flash-8b',
            'models/gemini-1.5-flash-8b-latest',
            'models/gemini-2.0-flash',
            'models/gemini-2.0-flash-001',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-pro-latest',
            'models/gemini-1.0-pro',
            'models/gemini-pro'
        ]
        
        # Find the first available preferred model
        selected_model = None
        for preferred in preferred_models:
            if preferred in available_models:
                selected_model = preferred
                break
        
        # If no preferred model is available, use the first available model
        if not selected_model and available_models:
            selected_model = available_models[0]
        
        if selected_model:
            model = genai.GenerativeModel(selected_model)
            logger.info(f"Selected Gemini model: {selected_model}")
        else:
            logger.error("No suitable Gemini models found")
    except Exception as e:
        logger.error(f"Could not list Gemini models: {e}")
        logger.error("AI features will be disabled due to model configuration error")
else:
    logger.warning("GEMINI_API_KEY not found. AI features will be disabled.")

# Load mock data at startup
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Simple in-memory cache for API responses (to reduce API calls)
response_cache = {}
CACHE_DURATION = 300  # 5 minutes cache

def load_financial_data():
    data = {}
    files = ['assets', 'liabilities', 'transactions', 'epf', 'credit_score', 'investments']
    for fname in files:
        try:
            file_path = os.path.join(DATA_DIR, f'{fname}.json')
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    data[fname] = json.load(f)
                logger.info(f"Loaded {fname}.json successfully")
            else:
                logger.warning(f"File {fname}.json not found")
                data[fname] = {}
        except Exception as e:
            logger.error(f"Error loading {fname}.json: {str(e)}")
            data[fname] = {}
    return data

financial_data = load_financial_data()

# Default permissions
default_permissions = {
    "assets": True,
    "liabilities": True,
    "transactions": True,
    "epf": True,
    "credit_score": True,
    "investments": True
}

# Utility functions
def filter_transactions_by_timeframe(transactions, timeframe):
    now = datetime.now()
    if timeframe == "last_week":
        start_date = now - timedelta(weeks=1)
    elif timeframe == "last_month":
        start_date = now - timedelta(days=30)
    elif timeframe == "last_quarter":
        start_date = now - timedelta(days=90)
    elif timeframe == "last_year":
        start_date = now - timedelta(days=365)
    else:  # 'all'
        return transactions
    
    filtered = []
    for txn in transactions:
        try:
            t_date = datetime.strptime(txn['date'], '%Y-%m-%d')
            if t_date >= start_date:
                filtered.append(txn)
        except ValueError:
            logger.warning(f"Invalid date format in transaction: {txn}")
    return filtered

def calculate_spending_summary(transactions):
    total_income = 0
    total_expenses = 0
    category_totals = {}
    
    for txn in transactions:
        amount = txn.get('amount', 0)
        category = txn.get('category', 'other')
        
        if amount > 0:
            total_income += amount
        else:
            total_expenses += abs(amount)
            category_totals[category] = category_totals.get(category, 0) + abs(amount)
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_income": total_income - total_expenses,
        "category_breakdown": category_totals,
        "transaction_count": len(transactions)
    }

def calculate_net_worth(assets, liabilities):
    total_assets = 0
    total_liabilities = 0
    
    for accounts in assets.values():
        if isinstance(accounts, list):
            for acc in accounts:
                if 'balance' in acc:
                    total_assets += acc['balance']
                elif 'value' in acc:
                    total_assets += acc['value']
                elif 'estimated_value' in acc:
                    total_assets += acc['estimated_value']
    
    for liabs in liabilities.values():
        if isinstance(liabs, list):
            for liab in liabs:
                if 'balance' in liab:
                    total_liabilities += liab['balance']
    
    return {
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "net_worth": total_assets - total_liabilities
    }

# Enhanced Transaction Analysis Functions
def detect_spending_anomalies(transactions):
    """Detect unusual spending patterns"""
    if len(transactions) < 5:
        return {"anomalies": [], "message": "Not enough data for anomaly detection"}
    
    expenses = [abs(txn['amount']) for txn in transactions if txn['amount'] < 0]
    if not expenses:
        return {"anomalies": [], "message": "No expense transactions found"}
    
    # Calculate statistical thresholds
    mean_expense = statistics.mean(expenses)
    std_expense = statistics.stdev(expenses) if len(expenses) > 1 else 0
    threshold = mean_expense + (2 * std_expense)  # 2 standard deviations
    
    anomalies = []
    for txn in transactions:
        if txn['amount'] < 0 and abs(txn['amount']) > threshold:
            anomalies.append({
                "transaction": txn,
                "amount": abs(txn['amount']),
                "threshold": threshold,
                "deviation": abs(txn['amount']) - threshold
            })
    
    return {
        "anomalies": anomalies,
        "threshold": threshold,
        "mean_expense": mean_expense,
        "std_deviation": std_expense,
        "total_anomalies": len(anomalies)
    }

def forecast_future_spending(transactions, months_ahead=3):
    """Predict future expenses based on historical data"""
    if len(transactions) < 3:
        return {"error": "Not enough data for forecasting"}
    
    # Group expenses by month
    monthly_expenses = defaultdict(float)
    for txn in transactions:
        if txn['amount'] < 0:
            try:
                date = datetime.strptime(txn['date'], '%Y-%m-%d')
                month_key = f"{date.year}-{date.month:02d}"
                monthly_expenses[month_key] += abs(txn['amount'])
            except ValueError:
                continue
    
    if len(monthly_expenses) < 2:
        return {"error": "Not enough monthly data for forecasting"}
    
    # Simple trend analysis
    monthly_data = list(monthly_expenses.values())
    avg_monthly = sum(monthly_data) / len(monthly_data)
    
    # Calculate trend (simple linear trend)
    if len(monthly_data) >= 3:
        recent_avg = sum(monthly_data[-3:]) / 3
        older_avg = sum(monthly_data[:-3]) / max(1, len(monthly_data) - 3) if len(monthly_data) > 3 else monthly_data[0]
        trend = (recent_avg - older_avg) / max(1, len(monthly_data) - 3)
    else:
        trend = 0
    
    # Generate forecasts
    forecasts = []
    current_base = monthly_data[-1] if monthly_data else avg_monthly
    
    for i in range(1, months_ahead + 1):
        forecast = current_base + (trend * i)
        forecasts.append({
            "month": i,
            "predicted_amount": max(0, forecast),  # Ensure non-negative
            "confidence": "medium" if len(monthly_data) >= 6 else "low"
        })
    
    return {
        "forecasts": forecasts,
        "historical_average": avg_monthly,
        "trend": trend,
        "data_quality": "good" if len(monthly_data) >= 6 else "limited"
    }

def analyze_spending_trends(transactions):
    """Analyze spending trends and patterns"""
    if not transactions:
        return {"error": "No transactions to analyze"}
    
    # Category trends
    category_trends = defaultdict(lambda: {"amounts": [], "dates": []})
    monthly_totals = defaultdict(float)
    
    for txn in transactions:
        if txn['amount'] < 0:  # Only expenses
            category = txn.get('category', 'other')
            amount = abs(txn['amount'])
            
            category_trends[category]["amounts"].append(amount)
            category_trends[category]["dates"].append(txn['date'])
            
            try:
                date = datetime.strptime(txn['date'], '%Y-%m-%d')
                month_key = f"{date.year}-{date.month:02d}"
                monthly_totals[month_key] += amount
            except ValueError:
                continue
    
    # Analyze each category
    analysis = {}
    for category, data in category_trends.items():
        if len(data["amounts"]) >= 3:
            amounts = data["amounts"]
            avg_amount = sum(amounts) / len(amounts)
            recent_avg = sum(amounts[-3:]) / min(3, len(amounts))
            
            trend = "increasing" if recent_avg > avg_amount * 1.1 else \
                    "decreasing" if recent_avg < avg_amount * 0.9 else "stable"
            
            analysis[category] = {
                "total_spent": sum(amounts),
                "average_transaction": avg_amount,
                "transaction_count": len(amounts),
                "trend": trend,
                "recent_average": recent_avg
            }
    
    # Overall trend
    if len(monthly_totals) >= 2:
        monthly_values = list(monthly_totals.values())
        overall_trend = "increasing" if monthly_values[-1] > monthly_values[0] else "decreasing"
    else:
        overall_trend = "insufficient_data"
    
    return {
        "category_analysis": analysis,
        "overall_trend": overall_trend,
        "monthly_spending": dict(monthly_totals),
        "top_categories": sorted(analysis.items(), key=lambda x: x[1]["total_spent"], reverse=True)[:5]
    }

def generate_budget_recommendations(transactions):
    """Generate personalized budget recommendations"""
    if not transactions:
        return {"error": "No transactions to analyze"}
    
    # Calculate current spending by category
    category_spending = defaultdict(float)
    total_income = 0
    total_expenses = 0
    
    for txn in transactions:
        if txn['amount'] > 0:
            total_income += txn['amount']
        else:
            amount = abs(txn['amount'])
            total_expenses += amount
            category = txn.get('category', 'other')
            category_spending[category] += amount
    
    if total_expenses == 0:
        return {"error": "No expense data found"}
    
    # Standard budget percentages (50/30/20 rule adapted)
    recommended_percentages = {
        "food": 0.15,  # 15% of income
        "transportation": 0.12,  # 12% of income
        "utilities": 0.08,  # 8% of income
        "entertainment": 0.05,  # 5% of income
        "other": 0.10  # 10% for miscellaneous
    }
    
    recommendations = []
    monthly_income = total_income / max(1, len(set(txn['date'][:7] for txn in transactions if txn['amount'] > 0)))
    
    for category, current_spent in category_spending.items():
        if category in recommended_percentages:
            recommended_amount = monthly_income * recommended_percentages[category]
            difference = current_spent - recommended_amount
            
            if difference > recommended_amount * 0.2:  # 20% over budget
                recommendations.append({
                    "category": category,
                    "current_spending": current_spent,
                    "recommended_spending": recommended_amount,
                    "difference": difference,
                    "status": "over_budget",
                    "suggestion": f"Consider reducing {category} spending by ${difference:.2f}"
                })
            elif difference < -recommended_amount * 0.1:  # 10% under budget
                recommendations.append({
                    "category": category,
                    "current_spending": current_spent,
                    "recommended_spending": recommended_amount,
                    "difference": difference,
                    "status": "under_budget",
                    "suggestion": f"You have ${abs(difference):.2f} buffer in {category}"
                })
            else:
                recommendations.append({
                    "category": category,
                    "current_spending": current_spent,
                    "recommended_spending": recommended_amount,
                    "difference": difference,
                    "status": "on_track",
                    "suggestion": f"{category} spending is within recommended range"
                })
    
    # Overall financial health
    savings_rate = (total_income - total_expenses) / total_income if total_income > 0 else 0
    health_status = "excellent" if savings_rate >= 0.2 else \
                   "good" if savings_rate >= 0.1 else \
                   "needs_improvement" if savings_rate >= 0 else "concerning"
    
    return {
        "recommendations": recommendations,
        "current_savings_rate": savings_rate,
        "financial_health": health_status,
        "total_monthly_income": monthly_income,
        "total_monthly_expenses": total_expenses,
        "suggested_emergency_fund": monthly_income * 6
    }

def get_conversation_context():
    if 'conversation_history' not in session:
        session['conversation_history'] = []
    return session['conversation_history']

def add_to_conversation_context(user_query, ai_response):
    if 'conversation_history' not in session:
        session['conversation_history'] = []
    
    session['conversation_history'].append({
        "timestamp": datetime.now().isoformat(),
        "user_query": user_query,
        "ai_response": ai_response
    })
    
    # Keep only last 10 items
    session['conversation_history'] = session['conversation_history'][-10:]

def filter_data_by_permissions(data_type):
    perms = session.get('permissions', default_permissions)
    if perms.get(data_type, False):
        return financial_data.get(data_type, {})
    else:
        return {}

def get_cache_key(user_query, context_keys):
    """Generate a cache key for the query"""
    query_hash = hashlib.md5(user_query.encode()).hexdigest()
    context_str = "_".join(sorted(context_keys))
    return f"{query_hash}_{context_str}"

def get_cached_response(cache_key):
    """Get cached response if still valid"""
    if cache_key in response_cache:
        cached_time, response = response_cache[cache_key]
        if time.time() - cached_time < CACHE_DURATION:
            logger.info(f"Returning cached response for query")
            return response
        else:
            # Remove expired cache entry
            del response_cache[cache_key]
    return None

def cache_response(cache_key, response):
    """Cache the response"""
    response_cache[cache_key] = (time.time(), response)

def make_ai_request_with_retry(prompt, max_retries=3):
    """Make AI request with exponential backoff retry logic"""
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text if response.text else "Sorry, no response from AI now."
        except Exception as e:
            error_str = str(e)
            logger.warning(f"AI request attempt {attempt + 1} failed: {error_str}")
            
            # Check if it's a rate limit error
            if "429" in error_str or "rate limit" in error_str.lower():
                if attempt < max_retries - 1:
                    # Exponential backoff: wait 2^attempt seconds
                    wait_time = 2 ** attempt
                    logger.info(f"Rate limit hit, waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                    continue
                else:
                    return "AI service rate limit exceeded. Please wait a few minutes before trying again."
            else:
                # For other errors, don't retry
                raise e
    
    return "AI service temporarily unavailable. Please try again later."

# API namespaces
perm_ns = Namespace('permissions', description='User permissions management')
data_ns = Namespace('data', description='Financial data access')
query_ns = Namespace('query', description='AI finance chat queries')
session_ns = Namespace('session', description='User session management')
conv_ns = Namespace('conversation', description='Conversation history management')
health_ns = Namespace('health', description='Health check endpoint')
analytics_ns = Namespace('analytics', description='Advanced transaction analytics')

# Models for Swagger
permission_model = perm_ns.model('Permissions', {
    "assets": fields.Boolean(required=True, description="Access to assets data"),
    "liabilities": fields.Boolean(required=True, description="Access to liabilities data"),
    "transactions": fields.Boolean(required=True, description="Access to transactions data"),
    "epf": fields.Boolean(required=True, description="Access to EPF data"),
    "credit_score": fields.Boolean(required=True, description="Access to credit score data"),
    "investments": fields.Boolean(required=True, description="Access to investments data")
})

query_model = query_ns.model('Query', {
    "query": fields.String(required=True, description="User's natural language query")
})

financial_summary_model = data_ns.model('FinancialSummary', {
    'net_worth': fields.Raw(description='Net worth summary'),
    'spending': fields.Raw(description='Spending summary'),
    'investments': fields.Raw(description='Investment portfolio summary'),
    'monthlyIncome': fields.Float(description='Total income in last month'),
    'monthlyExpenses': fields.Float(description='Total expenses in last month'),
    'savingsRate': fields.Float(description='Savings rate percentage'),
    'creditScore': fields.Integer(description='Current credit score')
})

permissions_parser = reqparse.RequestParser()
# No params since permissions stored in session

data_type_parser = reqparse.RequestParser()
data_type_parser.add_argument('data_type', location='view_args', required=True, help='Type of financial data')

transactions_filter_parser = reqparse.RequestParser()
transactions_filter_parser.add_argument('timeframe', type=str, choices=('all', 'last_week', 'last_month', 'last_quarter', 'last_year'), default='all', location='args')

# Permission Resource
@perm_ns.route('')
class Permissions(Resource):
    @perm_ns.marshal_with(permission_model)
    def get(self):
        if 'permissions' not in session:
            session['permissions'] = default_permissions.copy()
        return session['permissions']
    
    @perm_ns.expect(permission_model)
    @perm_ns.marshal_with(permission_model)
    def post(self):
        data = request.json
        if 'permissions' not in session:
            session['permissions'] = default_permissions.copy()
        
        for key in default_permissions.keys():
            if key in data:
                session['permissions'][key] = data[key]
        
        return session['permissions']

# Data Resource
@data_ns.route('/<string:data_type>')
@api.doc(params={'data_type': 'Type of financial data'})
class FinancialData(Resource):
    def get(self, data_type):
        allowed = ['assets', 'liabilities', 'transactions', 'epf', 'credit_score', 'investments']
        if data_type not in allowed:
            return {"error": "Invalid data type"}, 400
        
        filtered = filter_data_by_permissions(data_type)
        return jsonify(filtered)

@data_ns.route('/transactions/filter')
class FilteredTransactions(Resource):
    @data_ns.expect(transactions_filter_parser)
    def get(self):
        args = transactions_filter_parser.parse_args()
        timeframe = args.get('timeframe', 'all')
        
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"transactions": []}
        
        transactions = transactions_data['transactions']
        if timeframe != 'all':
            transactions = filter_transactions_by_timeframe(transactions, timeframe)
        
        return {"transactions": transactions, "timeframe": timeframe}

@data_ns.route('/summary')
class FinancialSummary(Resource):
    @data_ns.marshal_with(financial_summary_model)
    def get(self):
        assets = filter_data_by_permissions('assets')
        liabilities = filter_data_by_permissions('liabilities')
        transactions_data = filter_data_by_permissions('transactions')
        investments = filter_data_by_permissions('investments')
        
        summary = {}
        
        if assets and liabilities:
            summary['net_worth'] = calculate_net_worth(assets, liabilities)
        
        if transactions_data and 'transactions' in transactions_data:
            summary['spending'] = calculate_spending_summary(transactions_data['transactions'])
        
        if investments and 'portfolio' in investments:
            summary['investments'] = investments['portfolio']
        
        # --- NEW: Frontend Metrics ---
        # Get transactions for the past month
        all_txns = transactions_data.get('transactions', []) if transactions_data else []
        one_month_ago = datetime.now() - timedelta(days=30)
        recent_txns = []
        for txn in all_txns:
            try:
                txn_date = datetime.strptime(txn['date'], '%Y-%m-%d')
                if txn_date >= one_month_ago:
                    recent_txns.append(txn)
            except ValueError:
                continue
        
        # Calculate monthly metrics
        monthly_income = sum(t['amount'] for t in recent_txns if t['amount'] > 0)
        monthly_expenses = sum(abs(t['amount']) for t in recent_txns if t['amount'] < 0)
        savings_rate = ((monthly_income - monthly_expenses) / monthly_income * 100) if monthly_income > 0 else 0.0
        
        # Get credit score
        credit_data = filter_data_by_permissions('credit_score')
        credit_score = credit_data.get('current_score') if credit_data else None
        
        # Add frontend metrics to summary
        summary.update({
            'monthlyIncome': monthly_income,
            'monthlyExpenses': monthly_expenses,
            'savingsRate': round(savings_rate, 1),
            'creditScore': credit_score
        })
        
        return summary

# Enhanced Analytics Endpoints
@analytics_ns.route('/anomalies')
class SpendingAnomalies(Resource):
    def get(self):
        """Detect unusual spending patterns"""
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"error": "No transaction data available"}, 400
        
        transactions = transactions_data['transactions']
        anomalies = detect_spending_anomalies(transactions)
        return anomalies

@analytics_ns.route('/forecast')
class SpendingForecast(Resource):
    def get(self):
        """Forecast future spending"""
        parser = reqparse.RequestParser()
        parser.add_argument('months', type=int, default=3, help='Number of months to forecast')
        args = parser.parse_args()
        
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"error": "No transaction data available"}, 400
        
        transactions = transactions_data['transactions']
        forecast = forecast_future_spending(transactions, args['months'])
        return forecast

@analytics_ns.route('/trends')
class SpendingTrends(Resource):
    def get(self):
        """Analyze spending trends and patterns"""
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"error": "No transaction data available"}, 400
        
        transactions = transactions_data['transactions']
        trends = analyze_spending_trends(transactions)
        return trends

@analytics_ns.route('/budget-recommendations')
class BudgetRecommendations(Resource):
    def get(self):
        """Generate personalized budget recommendations"""
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"error": "No transaction data available"}, 400
        
        transactions = transactions_data['transactions']
        recommendations = generate_budget_recommendations(transactions)
        return recommendations

@analytics_ns.route('/comprehensive')
class ComprehensiveAnalytics(Resource):
    def get(self):
        """Get all analytics in one call"""
        transactions_data = filter_data_by_permissions('transactions')
        if not transactions_data or 'transactions' not in transactions_data:
            return {"error": "No transaction data available"}, 400
        
        transactions = transactions_data['transactions']
        
        return {
            "anomalies": detect_spending_anomalies(transactions),
            "forecast": forecast_future_spending(transactions, 3),
            "trends": analyze_spending_trends(transactions),
            "budget_recommendations": generate_budget_recommendations(transactions),
            "summary": calculate_spending_summary(transactions)
        }

# Query AI Resource
@query_ns.route('')
class AIQuery(Resource):
    @query_ns.expect(query_model)
    def post(self):
        data = request.json
        if not data or 'query' not in data:
            return {"error": "Query is required"}, 400
        
        user_query = data['query'].strip()
        if not user_query:
            return {"error": "Query cannot be empty"}, 400
        
        conversation_history = get_conversation_context()
        perms = session.get('permissions', default_permissions)
        context_data = {k: financial_data[k] for k, v in perms.items() if v and k in financial_data}
        
        if model is None:
            return {"error": "AI service not available. Please check GEMINI_API_KEY configuration and available models."}, 503
        
        # Check cache first
        cache_key = get_cache_key(user_query, list(context_data.keys()))
        cached_response = get_cached_response(cache_key)
        
        if cached_response:
            ai_response = cached_response
        else:
            # Generate prompt
            prompt = generate_ai_prompt(user_query, context_data, conversation_history)
            
            try:
                ai_response = make_ai_request_with_retry(prompt)
                # Cache the successful response
                cache_response(cache_key, ai_response)
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                # Provide more specific error messages based on the error type
                if "404" in str(e) and "not found" in str(e):
                    ai_response = f"AI model configuration error: The selected model is not available. Please check your API configuration."
                elif "403" in str(e):
                    ai_response = f"AI service access denied: Please verify your API key permissions."
                elif "429" in str(e):
                    ai_response = f"AI service rate limit exceeded. Please wait a few minutes before trying again."
                else:
                    ai_response = f"Technical difficulties with AI service: {e}"
        
        add_to_conversation_context(user_query, ai_response)
        logger.info(f"AI Query processed - User: {user_query[:50]}...")
        
        return {
            "response": ai_response,
            "timestamp": datetime.now().isoformat(),
            "context_used": list(context_data.keys())
        }

# Session Management Resource
@session_ns.route('/init')
class InitSession(Resource):
    def post(self):
        session_id = str(uuid.uuid4())
        session['session_id'] = session_id
        session['permissions'] = default_permissions.copy()
        session['conversation_history'] = []
        session['created_at'] = datetime.now().isoformat()
        
        logger.info(f"New session initialized: {session_id}")
        
        return {
            "session_id": session_id,
            "permissions": session['permissions'],
            "created_at": session['created_at']
        }

@session_ns.route('/status')
class SessionStatus(Resource):
    def get(self):
        session_id = session.get('session_id')
        if not session_id:
            return {"error": "No active session"}, 404
        
        return {
            "session_id": session_id,
            "permissions": session.get('permissions', default_permissions),
            "conversation_count": len(session.get('conversation_history', [])),
            "created_at": session.get('created_at'),
            "ai_available": model is not None
        }

@session_ns.route('/clear')
class ClearSession(Resource):
    def post(self):
        session_id = session.get('session_id')
        session.clear()
        logger.info(f"Session cleared: {session_id}")
        return {"message": "Session cleared successfully"}

# Conversation History Resource
@conv_ns.route('/history')
class ConversationHistory(Resource):
    def get(self):
        history = get_conversation_context()
        return {
            "conversation_history": history,
            "count": len(history)
        }

@conv_ns.route('/clear')
class ClearConversation(Resource):
    def post(self):
        session['conversation_history'] = []
        logger.info("Conversation history cleared")
        return {"message": "Conversation history cleared successfully"}

@conv_ns.route('/cache/clear')
class ClearCache(Resource):
    def post(self):
        global response_cache
        cache_size = len(response_cache)
        response_cache.clear()
        logger.info(f"Response cache cleared ({cache_size} entries removed)")
        return {"message": f"Response cache cleared successfully ({cache_size} entries removed)"}

@conv_ns.route('/cache/status')
class CacheStatus(Resource):
    def get(self):
        return {
            "cache_size": len(response_cache),
            "cache_duration_minutes": CACHE_DURATION // 60,
            "cached_queries": list(response_cache.keys())[:10]  # Show first 10 for debugging
        }

# Health Check Resource
@health_ns.route('')
class HealthCheck(Resource):
    def get(self):
        try:
            model_info = "unavailable"
            if model:
                try:
                    # Get the model name from the model object
                    model_name = getattr(model, '_model_name', 'unknown')
                    model_info = f"available ({model_name})"
                except:
                    model_info = "available (unknown model)"
            
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "ai_service": model_info,
                "data_files_loaded": len([k for k, v in financial_data.items() if v]),
                "version": "1.0.0",
                "enhanced_analytics": "enabled"
            }
        
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "unhealthy", "error": str(e), "timestamp": datetime.now().isoformat()}, 500

# Enhanced AI prompt generation function with analytics integration
def generate_ai_prompt(user_query, context_data, conversation_history):
    conversation_context = ""
    if conversation_history:
        conversation_context = "\\n\\nPrevious conversation:\\n"
        for conv in conversation_history[-3:]:  # last 3
            conversation_context += f"User: {conv['user_query']}\\nAssistant: {conv['ai_response']}\\n\\n"

    financial_summary = ""
    if context_data:
        financial_summary = "\\n\\nFinancial Data Summary:\\n"
        
        if 'assets' in context_data and context_data['assets']:
            assets = context_data['assets']
            total_assets = 0
            for accounts in assets.values():
                if isinstance(accounts, list):
                    for acc in accounts:
                        if 'balance' in acc:
                            total_assets += acc['balance']
                        elif 'value' in acc:
                            total_assets += acc['value']
                        elif 'estimated_value' in acc:
                            total_assets += acc['estimated_value']
            financial_summary += f"Total Assets: ${total_assets:,.2f}\\n"

        if 'liabilities' in context_data and context_data['liabilities']:
            liabilities = context_data['liabilities']
            total_liabilities = 0
            for liabs in liabilities.values():
                if isinstance(liabs, list):
                    for liab in liabs:
                        if 'balance' in liab:
                            total_liabilities += liab['balance']
            financial_summary += f"Total Liabilities: ${total_liabilities:,.2f}\\n"

        if 'transactions' in context_data and context_data['transactions']:
            transactions = context_data['transactions'].get('transactions', [])
            if transactions:
                recent = transactions[:5]
                financial_summary += f"Recent Transactions: {len(recent)} transactions\\n"
                
                # ADD ENHANCED ANALYTICS
                try:
                    # Add analytics insights
                    anomalies = detect_spending_anomalies(transactions)
                    trends = analyze_spending_trends(transactions)
                    budget_recs = generate_budget_recommendations(transactions)
                    
                    financial_summary += f"\\nAdvanced Insights:\\n"
                    if anomalies.get('total_anomalies', 0) > 0:
                        financial_summary += f"- {anomalies['total_anomalies']} unusual spending transactions detected\\n"
                    
                    if 'category_analysis' in trends and trends['category_analysis']:
                        top_category = max(trends['category_analysis'].items(), key=lambda x: x[1]['total_spent'])[0]
                        financial_summary += f"- Highest spending category: {top_category}\\n"
                    
                    if 'financial_health' in budget_recs:
                        financial_summary += f"- Financial health status: {budget_recs['financial_health']}\\n"
                    
                    if 'current_savings_rate' in budget_recs:
                        savings_rate = budget_recs['current_savings_rate'] * 100
                        financial_summary += f"- Current savings rate: {savings_rate:.1f}%\\n"
                
                except Exception as e:
                    logger.warning(f"Could not generate analytics insights: {e}")

        if 'investments' in context_data and context_data['investments']:
            investments = context_data['investments']
            if 'portfolio' in investments:
                portfolio = investments['portfolio']
                financial_summary += f"Investment Portfolio Value: ${portfolio.get('total_value', 0):,.2f}\\n"
                financial_summary += f"Total Gain/Loss: ${portfolio.get('total_gain_loss', 0):,.2f} ({portfolio.get('total_gain_loss_percentage', 0):.1f}%)\\n"

        if 'credit_score' in context_data and context_data['credit_score']:
            credit_info = context_data['credit_score']
            if 'current_score' in credit_info:
                financial_summary += f"Credit Score: {credit_info['current_score']} ({credit_info.get('score_range', 'Unknown')})\\n"

    prompt = f"""You are a professional financial advisor AI assistant. You have access to the user's financial data and can provide personalized financial advice, analysis, and insights.

{conversation_context}

Current User Query: {user_query}

{financial_summary}

IMPORTANT FORMATTING REQUIREMENTS:
- ALWAYS format your response using bullet points (•) or numbered lists (1., 2., 3.)
- Break down information into clear, readable bullet points
- Do NOT write long paragraphs
- Each major point should be a separate bullet point
- Use sub-bullets for details when needed

Instructions:
1. Provide clear, actionable financial advice based on the user's data
2. Be specific and reference actual numbers from their financial data when relevant
3. Suggest concrete steps they can take to improve their financial situation
4. If the query is about spending, analyze their transaction patterns and use the advanced insights provided
5. If the query is about investments, provide insights on their portfolio performance
6. If the query is about debt, analyze their liabilities and suggest repayment strategies
7. Always maintain a professional, helpful, and encouraging tone
8. If you don't have enough data to answer a question, say so and suggest what information would be helpful
9. FORMAT ALL RESPONSES WITH BULLET POINTS - NO LONG PARAGRAPHS

EXAMPLE FORMAT:
• Main point 1 with financial data
• Main point 2 with specific advice
  - Sub-point with details
  - Another sub-point
• Main point 3 with action steps

Please provide your response in bullet point format:"""

    return prompt

# Register namespaces
api.add_namespace(perm_ns, path='/permissions')
api.add_namespace(data_ns, path='/data')
api.add_namespace(query_ns, path='/query')
api.add_namespace(session_ns, path='/session')
api.add_namespace(conv_ns, path='/conversation')
api.add_namespace(health_ns, path='/health')
api.add_namespace(analytics_ns, path='/analytics')

if __name__ == '__main__':
    logger.info("Starting AI Finance Assistant Backend with Enhanced Analytics...")
    app.run(debug=True, host='0.0.0.0', port=5000)
