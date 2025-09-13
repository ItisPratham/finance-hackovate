import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Target } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
// Empty state - all values will be populated once user provides data
const emptyData = {
  totalAssets: null,
  totalLiabilities: null,
  netWorth: null,
  monthlyIncome: null,
  monthlyExpenses: null,
  savingsRate: 0,
  creditScore: null,
  investments: null,
  cash: null,
  loans: null
};
type DashboardData = {
  totalAssets: number | null;
  totalLiabilities: number | null;
  netWorth: number | null;
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  savingsRate: number | null;
  creditScore: number | null;
  investments: number | null;
  cash: number | null;
  loans: number | null;
  categoryBreakdown: Record<string, number> | null;
};
export function Dashboard() {
  const [data, setData] = useState<DashboardData>({
  totalAssets: null,
  totalLiabilities: null,
  netWorth: null,
  monthlyIncome: null,
  monthlyExpenses: null,
  savingsRate: null,
  creditScore: null,
  investments: null,
  cash: null,
  loans: null,
  categoryBreakdown: null
});
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data/summary")
      .then(res => {
        const d = res.data;
        const totalIncome = d.spending?.total_income ?? null;
        const totalExpenses = d.spending?.total_expenses ?? null;
        const savingsRate = (totalIncome && totalExpenses)
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : null;

        setData({
          totalAssets: d.net_worth?.total_assets ?? null,
          totalLiabilities: d.net_worth?.total_liabilities ?? null,
          netWorth: d.net_worth?.net_worth ?? null,
          monthlyIncome: totalIncome,
          monthlyExpenses: totalExpenses,
          savingsRate: savingsRate ? Math.round(savingsRate) : null,
          creditScore: null, // not provided by API
          investments: d.investments?.total_value ?? null,
          cash: null, // not provided by API
          loans: null ,// not provided by API
          categoryBreakdown: d.spending?.category_breakdown ?? null
        });
      })
      .catch(err => {
        console.error("API fetch failed:", err);
      });
  }, []);
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
              <p className={`text-2xl ${data.totalAssets ? 'text-green-600' : 'text-gray-300'}`}>
                {formatCurrency(data.totalAssets)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Total Liabilities</p>
              <p className={`text-2xl ${data.totalLiabilities ? 'text-red-600' : 'text-gray-300'}`}>
                {formatCurrency(data.totalLiabilities)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Net Worth</p>
              <p className={`text-3xl ${data.netWorth ? 'text-blue-600' : 'text-gray-300'}`}>
                {formatCurrency(data.netWorth)}
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
              <p className="text-muted-foreground">Total Income</p>
            </div>
            <p className={`text-2xl ${data.monthlyIncome ? 'text-foreground' : 'text-gray-300'}`}>
              {formatCurrency(data.monthlyIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <p className="text-muted-foreground">Total Expenses</p>
            </div>
            <p className={`text-2xl ${data.monthlyExpenses ? 'text-foreground' : 'text-gray-300'}`}>
              {formatCurrency(data.monthlyExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-4 w-4 text-blue-600" />
              <p className="text-muted-foreground">Savings Rate</p>
            </div>
            <p className={`text-2xl ${data.savingsRate ? 'text-foreground' : 'text-gray-300'}`}>
              {formatNumber(data.savingsRate, '%')}
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
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.categoryBreakdown
      ? Object.entries(data.categoryBreakdown).map(([category, amount]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between">
              <span className="capitalize">{category}</span>
              <span className="text-foreground">{formatCurrency(amount)}</span>
            </div>
            <Progress value={amount} className="h-2" />
          </div>
        ))
      : <p className="text-gray-300">No category data</p>
    }
          
          </CardContent>
        </Card>

        {/* <Card>
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
        </Card> */}
      </div>
    </div>
  );
}
