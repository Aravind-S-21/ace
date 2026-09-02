import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCategories } from '@/data/mock/categories';

// AI Match Visualization Component (Hero right side)
function AIMatchVisualization() {
  const matchDimensions = [
    { label: 'Skill Match', score: 94, color: '#6366f1' },
    { label: 'Interest Match', score: 91, color: '#3b82f6' },
    { label: 'Career Fit', score: 96, color: '#10b981' },
    { label: 'Location Fit', score: 88, color: '#f59e0b' },
  ];

  return (
    <div className="relative">
      {/* Connection visual */}
      <div className="flex flex-col items-center gap-3">
        {/* Student Profile Card */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">AS</div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Alex Sharma</p>
              <p className="text-xs text-text-tertiary">CS · IIT Madras</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Python', 'ML', 'React'].map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary">{s}</span>
            ))}
          </div>
        </div>

        {/* AI Engine */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          <div className="w-px h-4 bg-primary/30" />
          <div className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-md flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
            </svg>
            AI MATCH ENGINE
          </div>
          <div className="w-px h-4 bg-primary/30" />
        </div>

        {/* Match Result Card */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base">⚡</div>
              <div>
                <p className="text-xs font-semibold text-text-primary">AI/ML Hackathon</p>
                <p className="text-xs text-text-tertiary">FutureTech</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-success tabular-nums">94%</p>
              <p className="text-xs text-text-tertiary">Match</p>
            </div>
          </div>

          <div className="space-y-2">
            {matchDimensions.map(dim => (
              <div key={dim.label} className="flex items-center gap-2">
                <span className="text-xs text-text-secondary w-20 shrink-0">{dim.label}</span>
                <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${dim.score}%`, backgroundColor: dim.color }}
                  />
                </div>
                <span className="text-xs font-medium tabular-nums w-7 text-right" style={{ color: dim.color }}>{dim.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature card for the features section
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-lg mb-3 group-hover:scale-105 transition-transform">{icon}</div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.04),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.03),transparent_50%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left side — Copy */}
              <div className="max-w-xl">
                <Badge variant="primary" className="mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="mr-1">
                    <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                  </svg>
                  AI-Powered Event Intelligence
                </Badge>

                <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight mb-4">
                  Find opportunities<br />
                  <span className="text-primary">that fit you.</span>
                </h1>

                <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-md">
                  AI-powered discovery that connects your skills, interests, career goals and location with the right student opportunities.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/explore">
                    <Button size="lg">
                      Explore Opportunities
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/student/search">
                    <Button variant="outline" size="lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                      </svg>
                      Ask AI
                    </Button>
                  </Link>
                </div>

                {/* Social proof */}
                <div className="mt-8 flex items-center gap-6 text-sm text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-text-primary">2,400+</span> Students
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-text-primary">120+</span> Events
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-text-primary">94%</span> Match Accuracy
                  </span>
                </div>
              </div>

              {/* Right side — AI Match Visualization */}
              <div className="flex justify-center lg:justify-end">
                <AIMatchVisualization />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section id="ai-intelligence" className="bg-bg-secondary border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <Badge variant="primary" className="mb-3">How It Works</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Intelligent Discovery, Not Just Search
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto">
                Our AI understands both you and the opportunities, creating meaningful connections instead of keyword matches.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon="🧠"
                title="AI Event Understanding"
                description="AI analyzes every event — skills needed, difficulty level, career relevance, and quality signals."
              />
              <FeatureCard
                icon="🎯"
                title="Personalized Matching"
                description="Your skills, interests, and goals create a unique profile that AI matches to the best opportunities."
              />
              <FeatureCard
                icon="🔍"
                title="Smart Search"
                description="Ask in natural language. AI understands intent and returns intelligent, ranked results."
              />
              <FeatureCard
                icon="📊"
                title="Skill Intelligence"
                description="AI tracks your skill growth from events, projects, and GitHub — building your verified skill profile."
              />
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES SECTION ===== */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Explore Opportunities
            </h2>
            <p className="text-text-secondary">
              Discover events across categories, matched to your profile.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.id}`}
                className="group bg-white rounded-xl border border-border p-4 text-center hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{cat.label}</h3>
                <p className="text-xs text-text-tertiary mt-1">{cat.count} opportunities</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="bg-bg-secondary border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Ready to find your next opportunity?
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Let AI match you with hackathons, internships, workshops, and projects that align with your skills and goals.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Get Started — It&apos;s Free</Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">Browse Events</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
