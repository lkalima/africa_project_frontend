'use client'; // This component requires user interaction, so it must be a client component.

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export const Header = () => {
  // Get the current search query from the URL to keep the input in sync
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();

  // Update the input field if the user navigates with the browser's back/forward buttons
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent a full page reload on form submission
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // If the search is empty, go to the search page without a query
      router.push('/search');
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center gap-8">
        <Link href="/" className="text-2xl font-extrabold text-white hover:text-blue-400 transition-colors">
          Africa Project
        </Link>
        <div className="flex-1 flex justify-center">
          {/* --- The Search Form --- */}
          <form onSubmit={handleSearch} className="w-full max-w-lg flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instruments, ethnic groups, regions..."
              className="w-full px-3 py-2 rounded-l-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go
            </button>
          </form>
        </div>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
          <Link href="/instruments" className="text-gray-300 hover:text-white">
            Instruments
          </Link>
          <Link href="/ethnic-groups" className="text-gray-300 hover:text-white">
            Ethnic Groups
          </Link>
          <Link href="/geographies" className="text-gray-300 hover:text-white">
            Geographies
          </Link>
        </div>
      </nav>
    </header>
  );
};