import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'horizontal' | 'compact';
  showImage?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  showImage = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Variant: Featured (Large Hero Presentation)
  if (variant === 'featured') {
    return (
      <article className="group relative bg-[#FFFFFF] border border-[#E5E5E5] rounded-sm overflow-hidden transition-all duration-200 hover:border-[#14213D]/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          <div className="lg:col-span-7 relative overflow-hidden bg-[#EAE8E1] min-h-[320px] sm:min-h-[400px]">
            {!imgError ? (
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full min-h-[320px] flex items-center justify-center p-8 bg-[#F0EDE6] text-[#737373]">
                <span className="font-heading text-lg font-medium tracking-tight">The Builder’s Log</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Unboxed Metadata (Zero-pill) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                <Link
                  to={`/category/${article.category}`}
                  className="hover:underline underline-offset-2"
                >
                  {article.categoryName}
                </Link>
                <span className="text-[#a3a3a3]" aria-hidden="true">·</span>
                <span className="text-[#737373] font-normal normal-case">{article.readTime}</span>
              </div>

              {/* Title */}
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#171717] tracking-tight leading-tight group-hover:text-[#14213D] transition-colors">
                <Link to={`/article/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-[#737373] text-base leading-relaxed font-body">
                {article.excerpt}
              </p>
            </div>

            {/* Author & Date Footer */}
            <div className="pt-6 mt-6 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#171717]">{article.author.name}</span>
                <span className="text-[#a3a3a3]">·</span>
                <span>{article.date}</span>
              </div>
              <Link
                to={`/article/${article.slug}`}
                className="font-semibold text-[#14213D] hover:text-[#3B82F6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                Read story →
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Horizontal (Used for Secondary Featured or List views)
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-6 items-start pb-8 border-b border-[#E5E5E5] last:border-b-0">
        {showImage && (
          <Link
            to={`/article/${article.slug}`}
            className="w-full sm:w-48 sm:h-32 shrink-0 overflow-hidden rounded-sm bg-[#EAE8E1] border border-[#E5E5E5]"
          >
            {!imgError ? (
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F0EDE6] text-[#737373] text-xs">
                Editorial
              </div>
            )}
          </Link>
        )}

        <div className="flex-1 space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <Link
              to={`/category/${article.category}`}
              className="text-[#3B82F6] font-semibold hover:underline"
            >
              {article.categoryName}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-[#171717] group-hover:text-[#14213D] transition-colors leading-snug">
            <Link to={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#737373] line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="text-xs text-[#737373] pt-1">
            By <span className="text-[#171717] font-medium">{article.author.name}</span>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Compact (Small headlines for sidebar / ticker lists)
  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-[#E5E5E5] last:border-b-0">
        <div className="flex items-center gap-2 text-[11px] text-[#737373] mb-1">
          <Link
            to={`/category/${article.category}`}
            className="text-[#3B82F6] font-medium hover:underline"
          >
            {article.categoryName}
          </Link>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <h4 className="font-heading font-semibold text-sm text-[#171717] group-hover:text-[#14213D] transition-colors leading-snug">
          <Link to={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
      </article>
    );
  }

  // Variant: Standard Grid Card
  return (
    <article className="group flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] rounded-sm overflow-hidden transition-all duration-200 hover:border-[#14213D]/40">
      {showImage && (
        <Link
          to={`/article/${article.slug}`}
          className="relative aspect-16/10 overflow-hidden bg-[#EAE8E1]"
        >
          {!imgError ? (
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F0EDE6] text-[#737373] text-sm">
              The Builder’s Log
            </div>
          )}
        </Link>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <Link
              to={`/category/${article.category}`}
              className="text-[#3B82F6] font-semibold hover:underline"
            >
              {article.categoryName}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#171717] group-hover:text-[#14213D] transition-colors leading-snug">
            <Link to={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#737373] line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
          <span className="font-medium text-[#171717]">{article.author.name}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );
};
