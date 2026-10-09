import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Check, Bookmark, BookOpen, Edit } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterBox } from '../components/NewsletterBox';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { articles, getArticle } = useArticles();
  const article = slug ? getArticle(slug) : undefined;

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <h1 className="font-heading font-extrabold text-3xl text-[#171717]">Story Not Found</h1>
        <p className="text-[#737373]">
          The article you are looking for may have been moved or does not exist.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded hover:bg-[#1e325c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to The Builder’s Log</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related articles (same category or general)
  const relatedArticles = articles.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  // Fallback to other articles if fewer than 3 in same category
  const additionalArticles =
    relatedArticles.length < 3
      ? articles.filter((a) => a.id !== article.id && !relatedArticles.includes(a)).slice(
          0,
          3 - relatedArticles.length
        )
      : [];

  const displayedRelated = [...relatedArticles, ...additionalArticles];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#3B82F6] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="pt-4 sm:pt-8">
        {/* Back navigation & Category */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between text-xs text-[#737373]">
          <Link
            to={`/category/${article.category}`}
            className="inline-flex items-center gap-1.5 font-semibold text-[#14213D] hover:text-[#3B82F6] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {article.categoryName}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[#737373] hover:text-[#14213D] transition-colors"
              title="Open Admin Dashboard"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Manage in Admin</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 hover:text-[#171717] transition-colors cursor-pointer"
              title="Copy article link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Link copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto space-y-4 mb-10 text-left">
          {/* Category kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
            <Link to={`/category/${article.category}`} className="hover:underline">
              {article.categoryName}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight leading-[1.18]">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-[#737373] leading-relaxed font-body">
            {article.excerpt}
          </p>

          {/* Bylines & Metadata */}
          <div className="pt-4 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4 text-xs text-[#737373]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-xs uppercase">
                {article.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <p className="font-semibold text-[#171717] text-sm">{article.author.name}</p>
                <p className="text-[#737373]">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#a3a3a3]" />
                {article.date}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#a3a3a3]" />
                {article.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="aspect-16/9 overflow-hidden rounded-sm bg-[#EAE8E1] border border-[#E5E5E5]">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {article.coverImageCaption && (
            <p className="text-xs text-[#737373] mt-2 italic text-center">
              {article.coverImageCaption}
            </p>
          )}
        </div>

        {/* Main Content Layout with optional Table of Contents */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left/Sidebar: Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-4 text-xs">
              <p className="font-bold uppercase tracking-wider text-[#14213D] font-heading flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Contents</span>
              </p>
              <nav className="space-y-2 border-l border-[#E5E5E5] pl-3">
                {article.sections
                  .filter((s) => s.heading)
                  .map((s, idx) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="block text-[#737373] hover:text-[#14213D] transition-colors leading-snug py-0.5"
                    >
                      {s.heading}
                    </a>
                  ))}
              </nav>

              <div className="pt-6 border-t border-[#E5E5E5] space-y-2">
                <p className="font-semibold text-[#171717]">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-[#737373] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Central Reading Column (65-75ch measure) */}
          <div className="lg:col-span-9 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-10 text-[#171717] font-body text-[16px] sm:text-[17px] leading-[1.8]">
              {article.sections.map((section, idx) => (
                <section key={idx} id={`section-${idx}`} className="space-y-4 scroll-mt-28">
                  {section.heading && (
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#171717] tracking-tight pt-4 first:pt-0">
                      {section.heading}
                    </h2>
                  )}

                  {section.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className={`text-[#262626] ${
                        idx === 0 && pIdx === 0
                          ? 'first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#14213D]'
                          : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {/* Optional Quote */}
                  {section.quote && (
                    <blockquote className="my-8 py-6 px-6 sm:px-8 bg-white border border-[#E5E5E5] rounded-sm space-y-2">
                      <p className="font-heading italic text-lg sm:text-xl text-[#14213D] leading-relaxed">
                        “{section.quote.text}”
                      </p>
                      {section.quote.citation && (
                        <footer className="text-xs uppercase tracking-wider text-[#737373]">
                          — {section.quote.citation}
                        </footer>
                      )}
                    </blockquote>
                  )}

                  {/* Optional Code Block */}
                  {section.codeBlock && (
                    <div className="my-6 rounded-sm bg-[#14213D] text-[#F8F7F3] p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto border border-[#14213D]">
                      {section.codeBlock.caption && (
                        <div className="text-[11px] text-gray-400 pb-2 mb-3 border-b border-white/10 uppercase tracking-wider">
                          {section.codeBlock.caption}
                        </div>
                      )}
                      <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                        <code>{section.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Optional Callout */}
                  {section.callout && (
                    <div className="my-6 p-5 sm:p-6 bg-white border border-[#E5E5E5] rounded-sm space-y-2">
                      <h4 className="font-heading font-bold text-sm text-[#14213D]">
                        {section.callout.title}
                      </h4>
                      <p className="text-sm text-[#737373] leading-relaxed">
                        {section.callout.text}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* End of article author bio */}
            <div className="mt-14 pt-8 border-t border-[#E5E5E5] flex items-start gap-4 bg-white p-6 rounded-sm border">
              <div className="w-12 h-12 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-sm uppercase shrink-0">
                {article.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="space-y-1">
                <p className="font-heading font-bold text-base text-[#171717]">{article.author.name}</p>
                <p className="text-xs text-[#3B82F6] font-medium">{article.author.role}</p>
                <p className="text-xs text-[#737373] leading-relaxed pt-1">
                  Writes explainers and essays on computing systems, architecture, and technology culture for The Builder’s Log.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {displayedRelated.length > 0 && (
          <section className="max-w-5xl mx-auto mt-20 pt-12 border-t border-[#E5E5E5]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                  Keep Reading
                </p>
                <h3 className="font-heading font-bold text-2xl text-[#171717] mt-1">
                  Related Stories
                </h3>
              </div>
              <Link
                to={`/category/${article.category}`}
                className="text-xs font-semibold text-[#14213D] hover:underline"
              >
                More in {article.categoryName} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedRelated.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <div className="max-w-5xl mx-auto mt-12">
          <NewsletterBox />
        </div>
      </article>
    </div>
  );
};
