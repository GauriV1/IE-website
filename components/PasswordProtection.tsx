'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PASSWORD = 'division';

export default function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('ie_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === PASSWORD) {
      sessionStorage.setItem('ie_authenticated', 'true');
      setIsAuthenticated(true);
      router.refresh();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whitman-lightblue">
        <div className="text-whitman-navy">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-whitman-lightblue to-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg border-2 border-whitman-navy p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-whitman-navy mb-2">
                Whitman College
              </h1>
              <h2 className="text-xl font-semibold text-whitman-blue mb-4">
                Division of Inclusive Excellence
              </h2>
              <p className="text-whitman-gray">
                Digital Handbook
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-whitman-navy mb-2">
                  Enter Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-whitman-navy rounded-md focus:ring-2 focus:ring-whitman-blue focus:border-whitman-blue text-whitman-navy"
                  placeholder="Password"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-whitman-navy text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
              >
                Access Handbook
              </button>
            </form>

            <p className="text-xs text-whitman-gray text-center mt-6">
              This is a protected resource. Please enter the password to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show protected content if authenticated
  return <>{children}</>;
}

