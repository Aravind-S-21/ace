import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-text-primary">AllCollegeEvent</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI-powered discovery that connects students with the right opportunities.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Platform</h4>
            <ul className="space-y-2">
              {['Explore', 'Hackathons', 'Internships', 'Workshops', 'Projects'].map((item) => (
                <li key={item}>
                  <Link href="/explore" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">AI Features</h4>
            <ul className="space-y-2">
              {['Smart Search', 'Recommendations', 'Skill Intelligence', 'GitHub Analysis', 'Organizer AI'].map((item) => (
                <li key={item}>
                  <Link href="/student/search" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Contact', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © 2026 AllCollegeEvent. AI Event Intelligence Platform.
          </p>
          <p className="text-xs text-text-tertiary">
            Built with ❤️ for students
          </p>
        </div>
      </div>
    </footer>
  );
}
