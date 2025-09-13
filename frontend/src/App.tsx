import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { FinanceHero } from "./components/FinanceHero";
import { Feedback } from "./components/Feedback";
import { Footer } from "./components/Footer";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Dashboard } from "./components/Dashboard";
import { ChatBot } from "./components/ChatBot";
import { Insights } from "./components/Insights";
import { PermissionCenter } from "./components/PermissionCenter";
import { Settings } from "./components/Settings";
import { DashboardNavigation } from "./components/DashboardNavigation";
import { Toaster } from "./components/ui/sonner";

type ViewType = "home" | "signin" | "signup";

function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>("home");

  const handleSignInClick = () => setCurrentView("signin");
  const handleSignUpClick = () => setCurrentView("signup");
  const handleBackToHome = () => setCurrentView("home");
  const handleSwitchToSignUp = () => setCurrentView("signup");
  const handleSwitchToSignIn = () => setCurrentView("signin");

  if (currentView === "signin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-800 text-white px-4">
        <SignIn onBack={handleBackToHome} onSwitchToSignUp={handleSwitchToSignUp} />
        <Toaster />
      </div>
    );
  }

  if (currentView === "signup") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-800 text-white px-4">
        <SignUp onBack={handleBackToHome} onSwitchToSignIn={handleSwitchToSignIn} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-purple-200 relative overflow-hidden">
      {/* Neon glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-violet-300/10 to-purple-500/20 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-400/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-200/40 rounded-full blur-2xl animate-pulse delay-500"></div>
      {/* Navigation */}
      <Navigation onSignInClick={handleSignInClick} onSignUpClick={handleSignUpClick} />

      {/* Main content */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 py-12">
          <FinanceHero />
        </section>

        <section className="max-w-5xl mx-auto px-6 py-12">
          <Feedback />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <Toaster />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/permissions" element={<PermissionCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}