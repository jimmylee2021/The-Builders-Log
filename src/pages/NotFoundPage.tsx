import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { CATEGORY_LIST } from '../data/categories';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#3B82F6]">
          Error 404
        </p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#171717] tracking-tight">
          Page not found.
        </h1>
        <p className="text-base text-[#737373] leading-relaxed max-w-lg mx-auto">
          The dispatch or document you requested cannot be located in the archive. It may have been archived,
          moved, or mistyped.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14213D] text-white text-xs font-semibold rounded hover:bg-[#1e325c] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E5E5] text-[#171717] text-xs font-semibold rounded hover:bg-[#F8F7F3] transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search the Archive</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-[#E5E5E5] text-left space-y-4 bg-white p-6 rounded-sm border">
        <p className="text-xs font-bold uppercase tracking-wider text-[#737373]">
          Explore by Section
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {CATEGORY_LIST.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="text-[#14213D] hover:text-[#3B82F6] hover:underline"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
