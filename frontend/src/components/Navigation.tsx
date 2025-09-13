import { Menu, User, TrendingUp, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";

interface NavigationProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export function Navigation({ onSignInClick, onSignUpClick }: NavigationProps) {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 justify_start">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary">FinanceAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Services
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Contact Us
            </a>
            
          </div>

          {/* Desktop Login */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Button variant="ghost" className="text-gray-600" onClick={onSignInClick}>
              Sign In
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={onSignUpClick}>
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <a href="#" className="text-lg text-gray-600 hover:text-primary transition-colors">
                    About
                  </a>
                  <a href="#" className="text-lg text-gray-600 hover:text-primary transition-colors">
                    Services
                  </a>
                  <a href="#" className="text-lg text-gray-600 hover:text-primary transition-colors">
                    Contact Us
                  </a>
                 
                  <div className="border-t pt-6 space-y-4">
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start text-gray-600" onClick={onSignInClick}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={onSignUpClick}>
                      Sign Up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}