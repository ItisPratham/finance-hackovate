import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Lightbulb, 
  ArrowRight,
  PiggyBank,
  CreditCard,
  Calendar,
  DollarSign
} from "lucide-react";

const insights = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Dining Expenses Trending Up',
    description: 'You spent 18% more on dining last month (₹18,450) compared to your 3-month average.',
    impact: 'High',
    savings: '₹5,000-7,000',
    action: 'Consider meal planning',
    category: 'Spending'
  },
  {
    id: 2,
    type: 'opportunity',
    icon: PiggyBank,
    title: 'Emergency Fund Goal',
    description: 'You\'re 73% towards your 6-month emergency fund goal. Great progress!',
    impact: 'Medium',
    savings: null,
    action: 'Add ₹25,000 more',
    category: 'Savings'
  },
  {
    id: 3,
    type: 'positive',
    icon: TrendingUp,
    title: 'Investment Growth',
    description: 'Your mutual fund portfolio gained 12.4% this quarter, outperforming market average.',
    impact: 'High',
    savings: null,
    action: 'Consider SIP increase',
    category: 'Investments'
  },
  {
    id: 4,
    type: 'suggestion',
    icon: CreditCard,
    title: 'Credit Utilization',
    description: 'Your credit utilization is at 35%. Reducing to under 30% could improve your credit score.',
    impact: 'Medium',
    savings: null,
    action: 'Pay down ₹8,000',
    category: 'Credit'
  }
];

const monthlyGoals = [
  {
    title: 'Reduce Dining Expenses',
    target: 15000,
    current: 18450,
    progress: 81,
    status: 'over'
  },
  {
    title: 'Emergency Fund',
    target: 100000,
    current: 73000,
    progress: 73,
    status: 'on-track'
  },
  {
    title: 'Investment SIP',
    target: 20000,
    current: 20000,
    progress: 100,
    status: 'achieved'
  }
];

export function Insights() {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'opportunity': return 'text-blue-600 bg-blue-100';
      case 'positive': return 'text-green-600 bg-green-100';
      case 'suggestion': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Financial Insights</h1>
        <p className="text-muted-foreground">AI-powered recommendations to improve your financial health</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <p className="text-muted-foreground">Active Insights</p>
            </div>
            <p className="text-2xl">4</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-muted-foreground">Potential Savings</p>
            </div>
            <p className="text-2xl">₹12K</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <p className="text-muted-foreground">Goals on Track</p>
            </div>
            <p className="text-2xl">2/3</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <p className="text-muted-foreground">This Month</p>
            </div>
            <p className="text-2xl">85%</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid gap-4">
        <h2>AI Recommendations</h2>
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          return (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3>{insight.title}</h3>
                        <Badge variant={getImpactColor(insight.impact)}>
                          {insight.impact} Impact
                        </Badge>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                      <p className="text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="outline" size="sm">
                          {insight.action}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                        {insight.savings && (
                          <span className="text-green-600">
                            Potential savings: {insight.savings}/month
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {monthlyGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span>{goal.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                  <Badge variant={
                    goal.status === 'achieved' ? 'default' :
                    goal.status === 'on-track' ? 'secondary' : 'destructive'
                  }>
                    {goal.status === 'achieved' ? 'Achieved' :
                     goal.status === 'on-track' ? 'On Track' : 'Over Budget'}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={Math.min(goal.progress, 100)} 
                className={`h-2 ${goal.status === 'over' ? '[&>div]:bg-red-500' : ''}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span>Review and reduce dining expenses</span>
              </div>
              <Button size="sm" variant="outline">Action</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <PiggyBank className="h-4 w-4 text-blue-600" />
                <span>Transfer ₹25,000 to emergency fund</span>
              </div>
              <Button size="sm" variant="outline">Action</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <span>Pay down credit card by ₹8,000</span>
              </div>
              <Button size="sm" variant="outline">Action</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
