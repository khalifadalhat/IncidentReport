import React from "react";
import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiShield,
  FiBarChart2,
  FiClock,
  FiHelpCircle,
} from "react-icons/fi";

const DashboardDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Real-Time <span className="text-blue-600">Customer Support</span>{" "}
            Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Connect customers, agents, and admins in one powerful ecosystem for
            seamless problem-solving
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/signup/customer"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/signin/customer"
              className="px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg text-lg font-medium hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
            
          </div>
          <div className="relative h-64 md:h-96 bg-blue-100 rounded-2xl overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-2xl h-64 bg-white rounded-lg shadow-xl">
                {/* Mock dashboard illustration */}
                <div className="absolute top-4 left-4 right-4 h-8 bg-gray-100 rounded"></div>
                <div className="absolute top-16 left-4 w-1/3 h-32 bg-blue-100 rounded"></div>
                <div className="absolute top-16 left-[38%] w-1/3 h-32 bg-green-100 rounded"></div>
                <div className="absolute top-16 right-4 w-1/4 h-32 bg-purple-100 rounded"></div>
                <div className="absolute bottom-4 left-4 right-4 h-16 bg-gray-50 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiMessageSquare className="w-8 h-8 text-blue-600" />,
                title: "Real-Time Chat",
                description:
                  "Instant messaging between customers and support agents with read receipts and typing indicators.",
              },
              {
                icon: <FiUsers className="w-8 h-8 text-blue-600" />,
                title: "Multi-Channel Support",
                description:
                  "Manage email, chat, and social media inquiries from a single dashboard.",
              },
              {
                icon: <FiShield className="w-8 h-8 text-blue-600" />,
                title: "Secure Platform",
                description:
                  "Enterprise-grade security with end-to-end encryption for all communications.",
              },
              {
                icon: <FiBarChart2 className="w-8 h-8 text-blue-600" />,
                title: "Performance Analytics",
                description:
                  "Track response times, resolution rates, and customer satisfaction metrics.",
              },
              {
                icon: <FiClock className="w-8 h-8 text-blue-600" />,
                title: "24/7 Availability",
                description:
                  "AI-powered responses when live agents aren't available.",
              },
              {
                icon: <FiHelpCircle className="w-8 h-8 text-blue-600" />,
                title: "Knowledge Base",
                description:
                  "Self-service portal with articles and FAQs to empower customers.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Trusted by Teams Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Reduced our response time by 75% while improving customer satisfaction scores.",
                author: "Sarah Johnson",
                role: "Support Manager, TechCorp",
              },
              {
                quote:
                  "The intuitive interface made onboarding our team a breeze. We were up and running in a day.",
                author: "Michael Chen",
                role: "Director of Operations",
              },
              {
                quote:
                  "Our customers love the seamless experience across all support channels.",
                author: "Emma Rodriguez",
                role: "Customer Success Lead",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-gray-600 italic mb-6">
                  "{testimonial.quote}"
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Support?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses delivering exceptional customer
            experiences
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup/customer"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-medium hover:bg-white hover:bg-opacity-10 transition"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">SupportPlatform</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
            <Link to="/privacy" className="hover:text-blue-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-300">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-blue-300">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SupportPlatform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardDetails;
