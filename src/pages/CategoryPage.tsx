import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { useArticles } from '../context/ArticlesContext';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterBox } from '../components/NewsletterBox';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { CategorySlug } from '../types';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { articles } = useArticles();

  const category = categorySlug ? CATEGORIES[categorySlug as CategorySlug] : undefined;

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <h1 className="font-heading font-extrabold text-3xl text-[#171717]">Section Not Found</h1>
        <p className="text-[#737373]">
          The category you are looking for does not exist in our editorial catalog.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded hover:bg-[#1e325c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  // Filter articles
  const categoryArticles = articles.filter((a) => a.category === category.slug);
  const featuredInCat = categoryArticles.find((a) => a.featured) || categoryArticles[0];
  const remainingInCat = categoryArticles.filter((a) => a.id !== featuredInCat?.id);

  return (
    <div className="space-y-12 sm:space-y-16 pt-4 sm:pt-8">
      {/* Category Header Banner */}
      <section className="pb-8 border-b border-[#E5E5E5] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
          <Link to="/" className="text-[#737373] hover:text-[#171717] transition-colors">
            The Builder’s Log
          </Link>
          <span className="text-[#a3a3a3]">/</span>
          <span>Section Archive</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight">
          {category.name}
        </h1>

        <p className="text-base sm:text-lg text-[#14213D] font-medium font-body max-w-3xl">
          {category.tagline}
        </p>

        <p className="text-sm text-[#737373] max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </section>

      {/* Featured in Category */}
      {featuredInCat && (
        <section aria-labelledby="category-featured-heading">
          <p id="category-featured-heading" className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-4">
            Highlighted Dispatch
          </p>
          <ArticleCard article={featuredInCat} variant="featured" />
        </section>
      )}

      {/* Article Grid */}
      <section aria-labelledby="category-archive-heading">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <h2 id="category-archive-heading" className="font-heading font-bold text-xl text-[#171717]">
            All Stories in {category.name} ({categoryArticles.length})
          </h2>
        </div>

        {remainingInCat.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingInCat.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : categoryArticles.length === 1 ? (
          <div className="bg-white p-8 rounded border border-[#E5E5E5] text-center text-sm text-[#737373]">
            More dispatches for this section are scheduled in upcoming weekly editions.
          </div>
        ) : (
          <div className="bg-white p-12 rounded border border-[#E5E5E5] text-center space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-[#a3a3a3]" />
            <h3 className="font-heading font-bold text-lg text-[#171717]">No articles yet</h3>
            <p className="text-xs text-[#737373] max-w-sm mx-auto">
              Our writers are currently working on essays for this category. Check back next week.
            </p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};
