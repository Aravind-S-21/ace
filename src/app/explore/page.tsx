'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockEvents } from '@/data/mock/events';
import { EventCategory, EventMode } from '@/types';

const categories: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'internship', label: 'Internships' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'competition', label: 'Competitions' },
  { id: 'project', label: 'Projects' },
];

const modes: { id: string; label: string }[] = [
  { id: 'all', label: 'All Modes' },
  { id: 'online', label: 'Online' },
  { id: 'offline', label: 'In Person' },
  { id: 'hybrid', label: 'Hybrid' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'date' | 'relevance'>('relevance');

  const filtered = useMemo(() => {
    let events = [...mockEvents];

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q) ||
          e.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      events = events.filter(e => e.category === selectedCategory);
    }

    if (selectedMode !== 'all') {
      events = events.filter(e => e.mode === selectedMode);
    }

    if (sortBy === 'deadline') {
      events.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'date') {
      events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }

    return events;
  }, [search, selectedCategory, selectedMode, sortBy]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-1">Explore Opportunities</h1>
            <p className="text-text-secondary text-sm">Discover hackathons, internships, workshops, and more.</p>
          </div>

          {/* Search + Filters */}
          <div className="bg-white rounded-xl border border-border p-4 mb-6">
            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, skills, organizations..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-180 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <span className="w-px h-6 bg-border hidden sm:block" />

              {/* Mode */}
              <select
                value={selectedMode}
                onChange={e => setSelectedMode(e.target.value)}
                className="text-xs border border-border rounded-lg px-3 py-1.5 bg-white text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {modes.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-border rounded-lg px-3 py-1.5 bg-white text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="deadline">Sort: Deadline</option>
                <option value="date">Sort: Start Date</option>
              </select>

              {/* Results count */}
              <span className="text-xs text-text-tertiary ml-auto">{filtered.length} results</span>
            </div>
          </div>

          {/* Results grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant={event.featured ? 'featured' : 'default'}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <h3 className="text-lg font-semibold text-text-primary mb-1">No events found</h3>
              <p className="text-sm text-text-secondary mb-4">Try adjusting your filters or search terms.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedMode('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
