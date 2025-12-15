import React from 'react';
import { Wallet, Mail, Phone } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Wallet size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Smart Budget</h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Planner</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-white text-lg font-bold mb-4">Contact the Developer</h2>
              <p className="text-slate-400 mb-6 max-w-sm">
                Need help with your budget app or want a custom solution? Reach out directly.
              </p>
              <div className="space-y-3">
                <a href="mailto:m.fahadasadshaikh@gmail.com" className="flex items-center space-x-3 hover:text-white transition-colors group">
                  <div className="p-2 bg-slate-800 rounded-full group-hover:bg-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span>m.fahadasadshaikh@gmail.com</span>
                </a>
                <a href="tel:0336893314" className="flex items-center space-x-3 hover:text-white transition-colors group">
                  <div className="p-2 bg-slate-800 rounded-full group-hover:bg-blue-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <span>0336 893314</span>
                </a>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Accessibility Commitment</h3>
              <p className="text-sm text-slate-400">
                This application is designed to be accessible to all users. We utilize high-contrast colors, clear typography, and ARIA labels to ensure a seamless experience for everyone.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Smart Budget Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};