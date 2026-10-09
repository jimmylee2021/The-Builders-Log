import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { searchArticles, SearchResult } from '../lib/search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_TOPICS = ['compression', 'AI', 'fintech', 'GPS', 'cloud', 'architecture', 'Africa'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { articles } = useArticles();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const matched = searchArticles(articles, query);
    setResults(matched);
  }, [query, articles]);

  if (!isOpen) return null;

  const handleSelectArticle = (slug: string) => {
    onClose();
    navigate(`/article/${slug}`);
  };

  const handleViewFullResults = () => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-sm shadow-2xl border border-[#E5E5E5] overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E5E5E5] px-4 py-3 sm:py-4">
          <Search className="w-5 h-5 text-[#737373] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, explainers, topics, or authors..."
            className="w-full text-base sm:text-lg text-[#171717] placeholder:text-[#a3a3a3] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#737373] hover:text-[#171717] rounded mr-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs text-[#737373] hover:text-[#171717] border border-[#E5E5E5] rounded hover:bg-[#F8F7F3]"
          >
            Esc
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-[#F8F7F3] border-b border-[#E5E5E5] flex items-center gap-2 overflow-x-auto text-xs text-[#737373]">
          <span className="shrink-0 font-medium text-[#171717]">Suggested:</span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setQuery(topic)}
              className="px-2.5 py-1 bg-white hover:bg-[#14213D] hover:text-white border border-[#E5E5E5] rounded text-xs transition-colors shrink-0"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E5E5E5]">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-[#737373] space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-[#a3a3a3] stroke-1" />
              <p className="text-sm font-medium text-[#171717]">Explore The Builder’s Log</p>
              <p className="text-xs">
                Type keywords like <span className="font-mono text-[#14213D]">compression</span>,{' '}
                <span className="font-mono text-[#14213D]">fintech</span>, or{' '}
                <span className="font-mono text-[#14213D]">AI</span> to search our archive.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.slice(0, 6).map(({ article }) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => handleSelectArticle(article.slug)}
                  className="w-full text-left p-4 hover:bg-[#F8F7F3] transition-colors flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#737373]">
                      <span className="text-[#3B82F6] font-semibold">{article.categoryName}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="font-heading font-semibold text-base text-[#171717] group-hover:text-[#14213D]">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#737373] line-clamp-1">{article.excerpt}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a3a3a3] group-hover:text-[#14213D] group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </button>
              ))}

              {results.length > 6 && (
                <div className="p-3 text-center bg-[#F8F7F3] border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={handleViewFullResults}
                    className="text-xs font-semibold text-[#14213D] hover:underline"
                  >
                    View all {results.length} matching stories →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#171717]">No stories found for "{query}"</p>
              <p className="text-xs text-[#737373] max-w-sm mx-auto">
                Try searching for related keywords such as algorithms, architecture, cloud, or economics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
