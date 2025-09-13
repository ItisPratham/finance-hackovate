import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { useState, useEffect } from "react";

const permissionCategories = [
  { id: 'assets', name: 'Assets & Investments', description: 'Bank accounts, investments, mutual funds, stocks', icon: '💰', sensitive: false },
  { id: 'liabilities', name: 'Loans & Liabilities', description: 'Credit cards, home loans, personal loans', icon: '💳', sensitive: true },
  { id: 'transactions', name: 'Transaction History', description: 'Spending patterns, income sources, transaction details', icon: '📊', sensitive: true },
  { id: 'epf', name: 'EPF & Retirement', description: 'Employee Provident Fund, retirement accounts', icon: '🏛️', sensitive: false },
  { id: 'credit_score', name: 'Credit Score & History', description: 'Credit bureau reports, credit utilization', icon: '📈', sensitive: true },
  { id: 'insurance', name: 'Insurance Policies', description: 'Life, health, vehicle insurance details', icon: '🛡️', sensitive: false }
];

const defaultPermissions: Record<string, boolean> = {
  assets: true,
  liabilities: true,
  transactions: false,
  epf: true,
  credit_score: false,
  insurance: true
};

export function PermissionCenter() {
  const [permissions, setPermissions] = useState<Record<string, boolean>>(defaultPermissions);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("permissions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setPermissions(parsed);
        }
      } catch (_) {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }, [permissions]);

  const togglePermission = (categoryId: string) => {
    setPermissions(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = Object.keys(permissions).length;

  return (
    <div className="space-y-6">
      <div>
        <h1>Data Permissions</h1>
        <p className="text-muted-foreground">Control what financial data you want to share for AI insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl">{enabledCount} / {totalCount}</p>
              <p className="text-muted-foreground">Categories enabled</p>
            </div>
            <Badge variant={enabledCount > totalCount / 2 ? "default" : "secondary"}>
              {enabledCount > totalCount / 2 ? "Good Coverage" : "Limited Access"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Permission Categories */}
      <div className="grid gap-4">
        {permissionCategories.map((category) => (
          <Card key={category.id} className={`transition-all ${permissions[category.id] ? 'ring-2 ring-green-200' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-base">{category.name}</Label>
                      {category.sensitive && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Sensitive
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {permissions[category.id] ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <Switch
                    checked={permissions[category.id]}
                    onCheckedChange={() => togglePermission(category.id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
