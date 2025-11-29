import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiShield,
  FiBarChart2,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiGlobe,
  FiAward,
  FiMenu,
  FiLinkedin,
  FiGithub,
  FiTwitter,
} from "react-icons/fi";
import { useState } from "react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <FiAlertTriangle className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                IncidentReport
              </span>
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                to="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Enterprise
              </Link>
            </div>

            {/* Desktop Buttons - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <FiMenu className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="#"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="#"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="#"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Enterprise
                </Link>
                <div className="h-px bg-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/[0.4] bg-[size:20px_20px]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <FiTrendingUp className="w-4 h-4" />
              Trusted by 10,000+ teams worldwide
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
                Incident Reporting
              </span>
              Platform
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Streamline incident management with real-time collaboration,
              AI-powered routing, and comprehensive analytics for teams of all
              sizes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/signup"
                className="group px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start Free Trial
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="#"
                className="px-12 py-5 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl text-lg font-semibold hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FiPlay className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500 w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-blue-500 w-5 h-5" />
                  <span>Setup in 5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-indigo-500 w-5 h-5" />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                Modern Incident Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From real-time collaboration to advanced analytics, we provide the
              tools to handle incidents efficiently and effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiMessageSquare,
                title: "Real-Time Collaboration",
                desc: "Live chat with agents, file sharing, and collaborative incident resolution",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: FiUsers,
                title: "Smart Agent Routing",
                desc: "AI-powered assignment to the right experts based on incident type and urgency",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: FiBarChart2,
                title: "Advanced Analytics",
                desc: "Real-time dashboards with response times, resolution rates, and team performance",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: FiClock,
                title: "24/7 Monitoring",
                desc: "Round-the-clock incident detection and automated escalation workflows",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: FiShield,
                title: "Enterprise Security",
                desc: "End-to-end encryption, audit trails, and compliance with industry standards",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                icon: FiGlobe,
                title: "Global Scale",
                desc: "Multi-region deployment with 99.9% uptime SLA and global CDN",
                gradient: "from-teal-500 to-blue-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-3xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Incidents Resolved" },
              { number: "99.9%", label: "Uptime SLA" },
              { number: "2min", label: "Avg Response Time" },
              { number: "24/7", label: "Support Coverage" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <FiAward className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Incident Management?
              </h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of teams that trust Incident Report for their
                critical incident reporting needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/signup"
                  className="px-12 py-5 bg-white text-blue-700 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="#"
                  className="px-12 py-5 border-2 border-white text-white rounded-2xl text-lg font-bold hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </div>
              <p className="text-sm opacity-80 mt-6">
                Free 14-day trial • No credit card required • Setup in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <FiAlertTriangle className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Incident Report
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Modern incident reporting and management platform for teams of
                all sizes.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="GitHub"
                >
                  <FiGithub className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Website"
                >
                  <FiGlobe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Footer Columns */}
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Changelog"],
              },
              {
                title: "Resources",
                links: [
                  "Documentation",
                  "API Reference",
                  "Help Center",
                  "Community",
                ],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Security"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4 text-white">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={`#`}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Incident Report. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="#"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FiPlay = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default LandingPage;
