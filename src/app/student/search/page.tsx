'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ScoreIndicator from '@/components/ui/ScoreIndicator';
import { aiSearch, getSearchSuggestions } from '@/lib/api/search';
import { SearchResult } from '@/types';
import { formatDate } from '@/lib/utils/cn';

const suggestions = [
  'Find AI hackathons in Chennai',
  'Show internships matching my Python skills',
  'Find opportunities that help me become an ML engineer',
  'Find events suitable for my current skill level',
  'Upcoming workshops on web development',
  'Remote-friendly data science competitions',
];

export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const data = await aiSearch(q);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-bold text-text-primary">AI Search</h1>
        </div>
        <p className="text-text-secondary text-sm max-w-md mx-auto">
          What kind of opportunity are you looking for?
        </p>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Describe what you're looking for..."
            className="w-full pl-12 pr-24 py-4 text-base border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button size="sm" onClick={() => handleSearch()} loading={loading}>
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Suggestions (before search) */}
      {!hasSearched && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="text-sm px-3 py-2 rounded-lg border border-border bg-white text-text-secondary hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-secondary">AI is searching for the best opportunities...</p>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && results.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="primary" size="sm">AI Results</Badge>
            <span className="text-sm text-text-secondary">{results.length} opportunities found for &ldquo;{query}&rdquo;</span>
          </div>

          <div className="space-y-4">
            {results.map((result, i) => (
              <Link key={result.event.id} href={`/events/${result.event.id}`} className="block group">
                <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Match score */}
                    <ScoreIndicator score={result.match.overall} size="md" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">
                        {result.event.title}
                      </h3>
                      <p className="text-sm text-text-secondary mb-2">
                        {result.event.organization} · {result.event.location} · {formatDate(result.event.startDate)}
                      </p>

                      {/* AI Reasoning */}
                      <div className="bg-primary-light rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                          </svg>
                          <span className="text-xs font-semibold text-primary">AI Reasoning</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{result.aiReasoning}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {result.event.skills.slice(0, 4).map(s => (
                          <Badge key={s} size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state after search */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-text-primary mb-1">No results found</h3>
          <p className="text-sm text-text-secondary">Try rephrasing your query or use one of the suggested prompts.</p>
        </div>
      )}
    </div>
  );
}
