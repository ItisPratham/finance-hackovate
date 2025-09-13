import { useState } from "react";
import { TrendingUp, DollarSign, PieChart, Bot, ArrowRight, CreditCard, Wallet, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function FinanceHero() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectAccounts = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
  };

  return (
    <section className="py-20 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl mb-6 text-gray-900">
            Your AI-Powered
            <span className="block text-primary">Finance Companion</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unify all your financial accounts, track assets and liabilities, and get personalized AI insights 
            to optimize your investments and accelerate debt repayment.
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleConnectAccounts}
              disabled={isConnecting}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white"
            >
              {isConnecting ? "Connecting..." : "Connect Your Accounts"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
          </div> */}

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Bank-level security
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              AI-powered insights
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Real-time tracking
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Asset Tracking</h3>
                  <Badge variant="secondary" className="text-xs">Real-time</Badge>
                </div>
              </div>
              <p className="text-gray-600">
                Monitor all your investments, savings, and assets across multiple accounts in one unified dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Debt Management</h3>
                  <Badge variant="secondary" className="text-xs">AI-optimized</Badge>
                </div>
              </div>
              <p className="text-gray-600">
                Track loans, credit cards, and debts with AI-powered repayment strategies to save on interest.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">AI Conversations</h3>
                  <Badge variant="secondary" className="text-xs">24/7 Available</Badge>
                </div>
              </div>
              <p className="text-gray-600">
                Chat with your personal finance AI for investment advice, budgeting tips, and financial planning.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Preview */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Your AI Finance Assistant</h3>
                  <p className="text-gray-600 text-sm">Get personalized insights and recommendations</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sample conversation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>You:</strong> "
                    how should I start saving to afford a vacation next year"
                  </p>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-gray-700 mb-3">
                    <strong className="text-primary">FinanceAI:</strong> Based on your current debts, I recommend the avalanche method:
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 ml-4">
                    <li>• Pay minimum on all cards</li>
                    <li>• Focus extra payments on Card A (24.99% APR, $2,341 balance)</li>
                    <li>• This will save you $847 in interest over 18 months</li>
                  </ul>
                  <Button variant="link" className="mt-3 p-0 h-auto text-primary">
                    Show detailed repayment plan →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-3">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl text-primary mb-2">$2.4B+</div>
            <div className="text-gray-600">Assets Tracked</div>
          </div>
          <div>
            <div className="flex justify-center mb-3">
              <PieChart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl text-primary mb-2">150K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="flex justify-center mb-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl text-primary mb-2">89%</div>
            <div className="text-gray-600">Debt Reduction</div>
          </div>
          <div>
            <div className="flex justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl text-primary mb-2">23%</div>
            <div className="text-gray-600">Avg. ROI Increase</div>
          </div>
        </div>
      </div>
    </section>
  );
}