'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request for demo purposes
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/student');
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-bg-secondary px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
              <p className="text-sm text-text-secondary mt-1">Sign in to your AllCollegeEvent account</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input label="Email" type="email" placeholder="alex@example.com" required />
              <Input label="Password" type="password" placeholder="••••••••" required />

              <Button fullWidth type="submit" loading={loading}>Sign In</Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">Get Started</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
