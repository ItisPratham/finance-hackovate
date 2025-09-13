import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Target } from "lucide-react";

// Empty state - all values will be populated once user provides data
const emptyData = {
  totalAssets: null,
  totalLiabilities: null,
  netWorth: null,
  monthlyIncome: null,
  monthlyExpenses: null,
  savingsRate: null,
  creditScore: null,
  investments: null,
  cash: null,
  loans: null
};

export function Dashboard() {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '---';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (value: number | null, suffix: string = '') => {
    if (value === null) return '---';
    return `${value}${suffix}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Financial Overview</h1>
        <p className="text-muted-foreground">Your complete financial picture at a glance</p>
      </div>

      {/* Net Worth Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Total Assets</p>
              <p className={`text-2xl ${emptyData.totalAssets ? 'text-green-600' : 'text-gray-300'}`}>
                {formatCurrency(emptyData.totalAssets)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Total Liabilities</p>
              <p className={`text-2xl ${emptyData.totalLiabilities ? 'text-red-600' : 'text-gray-300'}`}>
                {formatCurrency(emptyData.totalLiabilities)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Net Worth</p>
              <p className={`text-3xl ${emptyData.netWorth ? 'text-blue-600' : 'text-gray-300'}`}>
                {formatCurrency(emptyData.netWorth)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-muted-foreground">Monthly Income</p>
            </div>
            <p className={`text-2xl ${emptyData.monthlyIncome ? 'text-foreground' : 'text-gray-300'}`}>
              {formatCurrency(emptyData.monthlyIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <p className="text-muted-foreground">Monthly Expenses</p>
            </div>
            <p className={`text-2xl ${emptyData.monthlyExpenses ? 'text-foreground' : 'text-gray-300'}`}>
              {formatCurrency(emptyData.monthlyExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-4 w-4 text-blue-600" />
              <p className="text-muted-foreground">Savings Rate</p>
            </div>
            <p className={`text-2xl ${emptyData.savingsRate ? 'text-foreground' : 'text-gray-300'}`}>
              {formatNumber(emptyData.savingsRate, '%')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <p className="text-muted-foreground">Credit Score</p>
            </div>
            <p className={`text-2xl ${emptyData.creditScore ? 'text-foreground' : 'text-gray-300'}`}>
              {formatNumber(emptyData.creditScore)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Investments</span>
                <span className={emptyData.investments ? 'text-foreground' : 'text-gray-300'}>
                  {formatCurrency(emptyData.investments)}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cash & Savings</span>
                <span className={emptyData.cash ? 'text-foreground' : 'text-gray-300'}>
                  {formatCurrency(emptyData.cash)}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Real Estate</span>
                <span className="text-gray-300">---</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debt Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Home Loan</span>
                <span className="text-gray-300">---</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Credit Cards</span>
                <span className="text-gray-300">---</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Personal Loan</span>
                <span className="text-gray-300">---</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
