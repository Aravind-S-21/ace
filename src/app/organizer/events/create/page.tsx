'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/organizer/events');
  };

  return (
    <div className="p-4 lg:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Create Event</h1>
        <p className="text-sm text-text-secondary">Fill in the details to create a new event listing.</p>
      </div>

      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input label="Event Title" placeholder="AI/ML Innovation Hackathon 2026" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
                <option value="project">Project</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Mode</label>
              <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <Input label="Organization" placeholder="FutureTech Labs" required />
          <Input label="Location" placeholder="Chennai, India" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" required />
          </div>

          <Input label="Registration Deadline" type="date" required />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-y"
              placeholder="Describe your event..."
              required
            />
          </div>

          <Input label="Skills (comma-separated)" placeholder="Python, Machine Learning, TensorFlow" required />
          <Input label="Prize (optional)" placeholder="₹2,00,000" />
          <Input label="Team Size" placeholder="2-4" />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Create Event</Button>
            <Button variant="secondary" onClick={() => router.push('/organizer/events')} type="button">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
