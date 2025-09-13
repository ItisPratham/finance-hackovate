import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Feedback() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Financial Advisor",
      company: "Wealth Partners",
      content: "FinanceAI has transformed how I help my clients manage their portfolios. The AI insights are incredibly accurate and actionable.",
      rating: 5,
      initials: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Small Business Owner", 
      company: "Rodriguez Consulting",
      content: "I paid off $45,000 in debt 2 years earlier than planned using the AI's repayment strategy. This app literally saved me thousands!",
      rating: 5,
      initials: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Investment Analyst",
      company: "Capital Growth",
      content: "The unified dashboard gives me a complete picture of my finances. The AI conversations feel like having a personal CFO.",
      rating: 5,
      initials: "ET"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with AI-powered insights and guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-1 h-6 w-6 text-gray-300" />
                  <p className="text-gray-700 italic pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl text-primary mb-2">$890K</div>
              <div className="text-gray-600">Avg. Debt Paid Off</div>
            </div>
            <div>
              <div className="text-3xl text-primary mb-2">150K+</div>
              <div className="text-gray-600">Financial Goals Achieved</div>
            </div>
            <div>
              <div className="text-3xl text-primary mb-2">4.9/5</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl text-primary mb-2">12 Mo</div>
              <div className="text-gray-600">Avg. Payoff Acceleration</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}