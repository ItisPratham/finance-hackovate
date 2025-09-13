# AI Finance Assistant

> **🏆 Hackathon Project**: Problem Statement 1 - "Let AI Speak to Your Money"

An intelligent, AI-powered personal finance assistant that provides personalized financial insights, anomaly detection, spending forecasts, and actionable recommendations through natural language conversations.

## 🚀 Features

### Core Capabilities
- **🤖 AI-Powered Conversations**: Natural language financial queries using Google Gemini
- **🔒 Privacy-First Design**: Granular permission controls for data categories
- **📊 Advanced Analytics**: Spending anomalies, trend analysis, and predictive forecasting
- **💡 Smart Recommendations**: Personalized budget advice and financial health insights
- **🔄 Context Awareness**: Maintains conversation history for follow-up queries
- **⚡ Real-Time Processing**: Instant financial analysis and insights

### Advanced Analytics Engine
- **Anomaly Detection**: Identifies unusual spending patterns using statistical analysis
- **Spending Forecasts**: Predicts future expenses based on historical data
- **Trend Analysis**: Comprehensive spending pattern analysis by category
- **Budget Optimization**: Personalized recommendations using 50/30/20 rule
- **Financial Health Scoring**: Automatic assessment of financial well-being

### Data Management
- **Multi-Category Support**: Assets, Liabilities, Transactions, Investments, Credit Score, EPF
- **Permission-Based Access**: Users control which data categories the AI can access
- **Session Management**: Secure session handling with conversation persistence
- **Data Validation**: Robust parsing and validation of financial data

## 🛠 Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend Framework** | Flask + Flask-RESTX |
| **AI/ML Engine** | Google Gemini API |
| **API Documentation** | Swagger/OpenAPI |
| **Data Storage** | JSON-based mock data |
| **Authentication** | Session-based management |
| **Analytics** | Statistical analysis with Python |
| **CORS Support** | Flask-CORS |
| **Caching** | In-memory response caching |

## 📋 Prerequisites

- Python 3.8+
- Google Gemini API Key
- pip (Python package manager)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-finance-assistant
```

### 2. Install Dependencies
```bash
pip install flask flask-restx flask-cors google-generativeai python-dotenv
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Security
SECRET_KEY=your-secret-key-change-in-production

# Logging
LOG_LEVEL=INFO
```

### 4. Data Setup
Create a `data/` directory and place the JSON files:
```
data/
├── assets.json
├── liabilities.json
├── transactions.json
├── credit_score.json
├── epf.json
└── investments.json
```

### 5. Run the Application
```bash
python main.py
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:5000/docs`
- **Health Check**: `http://localhost:5000/health`

### Core Endpoints

#### 🔐 Permissions Management
```http
GET /permissions          # Get current permissions
POST /permissions         # Update permissions
```

#### 📊 Financial Data Access
```http
GET /data/summary                    # Complete financial summary
GET /data/<type>                     # Specific data type (assets, liabilities, etc.)
GET /data/transactions/filter        # Filtered transactions by timeframe
```

#### 🤖 AI Query Interface
```http
POST /query                          # Natural language financial queries
```

#### 📈 Advanced Analytics
```http
GET /analytics/anomalies            # Spending anomaly detection
GET /analytics/forecast             # Future spending predictions  
GET /analytics/trends               # Spending pattern analysis
GET /analytics/budget-recommendations  # Personalized budget advice
GET /analytics/comprehensive       # All analytics in one call
```

#### 🔄 Session & Conversation
```http
POST /session/init                  # Initialize new session
GET /session/status                 # Check session status
GET /conversation/history           # Conversation history
```

## 💬 Usage Examples

### Basic Financial Query
```bash
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is my current net worth?"}'
```

### Get Spending Anomalies
```bash
curl http://localhost:5000/analytics/anomalies
```

### Update Data Permissions
```bash
curl -X POST http://localhost:5000/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "assets": true,
    "liabilities": true,
    "transactions": true,
    "credit_score": false,
    "epf": false,
    "investments": true
  }'
```

### Sample AI Conversations
- *"Can I afford to take a vacation next month?"*
- *"Why did my expenses increase last quarter?"*
- *"What's my best option for repaying my loan faster?"*
- *"Show me any unusual spending patterns this month"*
- *"What's my investment performance compared to the market?"*

## 📁 Project Structure

```
ai-finance-assistant/
├── main.py                 # Main Flask application
├── config.py               # Configuration management
├── README.md               # Project documentation
├── .env                    # Environment variables (create this)
├── data/                   # Financial data directory
│   ├── assets.json
│   ├── liabilities.json
│   ├── transactions.json
│   ├── credit_score.json
│   ├── epf.json
│   └── investments.json
└── requirements.txt        # Python dependencies (optional)
```

## 🧠 AI Capabilities

### Intelligent Financial Analysis
- **Contextual Understanding**: Maintains conversation context for natural follow-ups
- **Data-Driven Insights**: All recommendations based on actual financial data
- **Privacy Awareness**: Only uses data categories granted permission
- **Actionable Advice**: Provides specific, implementable financial recommendations

### Advanced Analytics Features
- **Statistical Anomaly Detection**: Uses mean and standard deviation analysis
- **Predictive Modeling**: Simple trend-based forecasting for future spending
- **Category Intelligence**: Analyzes spending patterns across different categories
- **Financial Health Assessment**: Comprehensive evaluation using industry standards

## 🔒 Security & Privacy

- **Permission-Based Access**: Granular control over data categories
- **Session Security**: Secure session management with UUIDs
- **Data Isolation**: User permissions enforced at the data layer
- **API Rate Limiting**: Built-in retry logic and rate limit handling
- **Error Handling**: Comprehensive error management and logging

## 🚦 System Health & Monitoring

- **Health Checks**: `/health` endpoint for system status monitoring
- **Logging**: Comprehensive logging for debugging and monitoring
- **Caching**: Response caching for improved performance
- **Error Recovery**: Automatic retry logic for AI service calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is developed for educational and hackathon purposes. Please ensure you have appropriate API keys and follow the terms of service for all integrated services.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the conversational interface
- **Flask Community** for the excellent web framework
- **Hackathon Organizers** for the inspiring challenge

---

**Built with ❤️ for the AI Finance Assistant Hackathon Challenge**