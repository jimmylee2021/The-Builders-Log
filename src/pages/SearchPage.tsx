import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, BookOpen } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { searchArticles, SearchResult } from '../lib/search';
import { ArticleCard } from '../components/ArticleCard';

const POPULAR_TAGS = ['compression', 'AI', 'fintech', 'GPS', 'cloud', 'architecture', 'Africa', 'Algorithms'];

export const SearchPage: React.FC = () => {
  const { articles } = useArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.trim()) {
      setResults(searchArticles(articles, q));
    } else {
      setResults([]);
    }
  }, [searchParams, articles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setSearchParams({ q: tag });
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <div className="space-y-10 pt-4 sm:pt-8 max-w-5xl mx-auto">
      {/* Header */}
      <section className="space-y-2 pb-6 border-b border-[#E5E5E5]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
          Archive & Index
        </p>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#171717] tracking-tight">
          Search The Builder’s Log
        </h1>
        <p className="text-sm text-[#737373]">
          Explore explainers, architecture retrospectives, and reporting across our entire index.
        </p>
      </section>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="relative flex items-center bg-white border border-[#E5E5E5] rounded-sm shadow-xs focus-within:border-[#14213D] focus-within:ring-1 focus-within:ring-[#14213D]">
          <Search className="w-5 h-5 text-[#737373] ml-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, keyword, category, or author (e.g. compression, fintech, AI)..."
            className="w-full px-3 py-4 text-base sm:text-lg text-[#171717] bg-transparent focus:outline-none placeholder:text-[#a3a3a3]"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-[#737373] hover:text-[#171717] mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="hidden sm:inline-flex px-5 py-2.5 mr-2 text-xs font-semibold text-white bg-[#14213D] hover:bg-[#1e325c] rounded transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
          <span className="font-medium text-[#171717]">Suggested terms:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 bg-white hover:bg-[#14213D] hover:text-white border border-[#E5E5E5] rounded transition-colors text-xs"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>

      {/* Results Section */}
      <section aria-live="polite">
        {query.trim() === '' ? (
          <div className="bg-white border border-[#E5E5E5] p-12 rounded text-center space-y-4">
            <BookOpen className="w-10 h-10 text-[#a3a3a3] mx-auto stroke-1" />
            <h2 className="font-heading font-bold text-lg text-[#171717]">
              Browse the entire catalog
            </h2>
            <p className="text-sm text-[#737373] max-w-md mx-auto">
              Or start with one of our featured topics like <span className="text-[#14213D] font-medium">compression algorithms</span>,{' '}
              <span className="text-[#14213D] font-medium">African mobile money</span>, or{' '}
              <span className="text-[#14213D] font-medium">satellite navigation</span>.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] text-xs text-[#737373]">
              <p>
                Found <span className="font-bold text-[#171717]">{results.length}</span>{' '}
                {results.length === 1 ? 'match' : 'matches'} for "{query}"
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="text-[#3B82F6] hover:underline"
              >
                Clear search
              </button>
            </div>

            <div className="space-y-6">
              {results.map(({ article }) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E5E5] p-12 rounded text-center space-y-4">
            <h2 className="font-heading font-bold text-xl text-[#171717]">
              No results found for "{query}"
            </h2>
            <p className="text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
              We couldn't find any articles matching your search terms. Check your spelling, try more general terms, or explore one of our sections directly.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center text-xs font-semibold text-[#14213D] hover:underline"
              >
                ← Return to homepage
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
