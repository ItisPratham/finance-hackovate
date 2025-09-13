import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Download, 
  Trash2, 
  Eye,
  Lock,
  Smartphone,
  Mail
} from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [notifications, setNotifications] = useState({
    spendingAlerts: true,
    goalUpdates: true,
    weeklyReports: false,
    securityAlerts: true,
    marketUpdates: false
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Manage your account, privacy, and notification preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                RK
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3>Rajesh Kumar</h3>
              <p className="text-muted-foreground">rajesh.kumar@email.com</p>
              <Badge variant="secondary">Premium Member</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span>+91 98765 43210</span>
                <Badge variant="outline" className="text-xs">Verified</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>rajesh.kumar@email.com</span>
                <Badge variant="outline" className="text-xs">Verified</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Badge variant="outline" className="text-green-600">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Data Sharing with Partners</Label>
                <p className="text-muted-foreground">Allow sharing anonymized data for better insights</p>
              </div>
              <Switch
                checked={privacy.dataSharing}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Usage Analytics</Label>
                <p className="text-muted-foreground">Help improve our services with usage data</p>
              </div>
              <Switch
                checked={privacy.analytics}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, analytics: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Marketing Communications</Label>
                <p className="text-muted-foreground">Receive promotional emails and offers</p>
              </div>
              <Switch
                checked={privacy.marketing}
                onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, marketing: checked }))}
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Data Permissions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Spending Alerts</Label>
              <p className="text-muted-foreground">Get notified when you exceed budget limits</p>
            </div>
            <Switch
              checked={notifications.spendingAlerts}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, spendingAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Goal Updates</Label>
              <p className="text-muted-foreground">Progress updates on your financial goals</p>
            </div>
            <Switch
              checked={notifications.goalUpdates}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, goalUpdates: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Weekly Reports</Label>
              <p className="text-muted-foreground">Summary of your financial activity</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Security Alerts</Label>
              <p className="text-muted-foreground">Important security notifications</p>
            </div>
            <Switch
              checked={notifications.securityAlerts}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, securityAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Market Updates</Label>
              <p className="text-muted-foreground">Investment and market news</p>
            </div>
            <Switch
              checked={notifications.marketUpdates}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketUpdates: checked }))}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select defaultValue="instant">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Financial Report
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-900">Danger Zone</h4>
                <p className="text-red-700 text-sm mt-1">
                  These actions cannot be undone. Please proceed with caution.
                </p>
                <Button variant="destructive" className="mt-3" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
