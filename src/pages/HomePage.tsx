import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Layers, TrendingUp, Terminal } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterBox } from '../components/NewsletterBox';

export const HomePage: React.FC = () => {
  const { articles } = useArticles();

  // 1. Featured Story: explicitly featured or fall back to compression story or first story
  const featuredArticle =
    articles.find((a) => a.featured) ||
    articles.find((a) => a.slug === 'how-does-a-10gb-file-become-2gb-understanding-file-compression') ||
    articles[0];

  // 2. Latest Stories (excluding featured)
  const remainingArticles = featuredArticle
    ? articles.filter((a) => a.id !== featuredArticle.id)
    : articles;
  const latestLead = remainingArticles[0];
  const latestSide = remainingArticles.slice(1, 4);

  // 3. Category subsets
  const techExplainedStories = articles.filter((a) => a.category === 'tech-explained').slice(0, 4);
  const aiStories = articles.filter((a) => a.category === 'ai-emerging-tech').slice(0, 3);
  const buildLogStories = articles.filter((a) => a.category === 'build-log').slice(0, 3);
  const startupStories = articles.filter((a) => a.category === 'startups-business').slice(0, 3);

  const scrollToLatest = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('latest-stories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* B. Editorial Introduction */}
      <section className="pt-6 sm:pt-10 pb-4 border-b border-[#E5E5E5]">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3B82F6] mb-3">
            Editorial Dispatch
          </p>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#171717] tracking-tight leading-[1.12] mb-6">
            Technology is everywhere. Understanding it changes everything.
          </h1>
          <p className="text-lg sm:text-xl text-[#737373] leading-relaxed font-body max-w-3xl mb-6">
            The Builder’s Log explores the ideas, technologies, and people shaping our digital world. Clear
            explanations, thoughtful stories, and lessons from the process of building.
          </p>
          <div>
            <a
              href="#latest-stories"
              onClick={scrollToLatest}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14213D] hover:text-[#3B82F6] transition-colors border-b border-[#14213D]/30 hover:border-[#3B82F6] pb-0.5"
            >
              <span>Explore latest stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* C. Featured Story */}
      <section aria-labelledby="featured-story-heading">
        <div className="flex items-center justify-between mb-4">
          <p id="featured-story-heading" className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            Featured Story
          </p>
          <span className="text-xs text-[#737373]">Cover Feature</span>
        </div>
        <ArticleCard article={featuredArticle} variant="featured" />
      </section>

      {/* D. Latest Stories with Varied Layout */}
      <section id="latest-stories" aria-labelledby="latest-stories-heading" className="scroll-mt-24">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div>
            <h2 id="latest-stories-heading" className="font-heading font-bold text-2xl text-[#171717]">
              Latest Stories
            </h2>
            <p className="text-xs text-[#737373] mt-1">Fresh reporting and essays from our editors</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#14213D] hover:text-[#3B82F6] flex items-center gap-1"
          >
            <span>View all stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Varied Grid: 1 visually prominent lead + 3 side columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {latestLead && (
            <div className="lg:col-span-7">
              <ArticleCard article={latestLead} variant="standard" />
            </div>
          )}
          <div className="lg:col-span-5 flex flex-col divide-y divide-[#E5E5E5] bg-white border border-[#E5E5E5] p-6 rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] pb-4">
              Trending Dispatches
            </h3>
            {latestSide.map((article) => (
              <div key={article.id} className="py-4 first:pt-4 last:pb-0">
                <ArticleCard article={article} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Tech Explained Section */}
      <section aria-labelledby="tech-explained-heading">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Section 01</span>
            </div>
            <h2 id="tech-explained-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#171717]">
              Tech Explained
            </h2>
            <p className="text-sm text-[#737373]">
              Accessible, demystifying breakdowns of the infrastructure and algorithms you interact with daily.
            </p>
          </div>
          <Link
            to="/category/tech-explained"
            className="hidden sm:flex text-xs font-semibold text-[#14213D] hover:text-[#3B82F6] items-center gap-1"
          >
            <span>Browse section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {techExplainedStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* F. AI & Emerging Tech Section */}
      <section aria-labelledby="ai-emerging-heading">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 02</span>
            </div>
            <h2 id="ai-emerging-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#171717]">
              AI & Emerging Tech
            </h2>
            <p className="text-sm text-[#737373]">
              Grounded, sober assessments of artificial intelligence, reasoning systems, and silicon hardware without exaggerated claims.
            </p>
          </div>
          <Link
            to="/category/ai-emerging-tech"
            className="hidden sm:flex text-xs font-semibold text-[#14213D] hover:text-[#3B82F6] items-center gap-1"
          >
            <span>Browse section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {aiStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* G. The Build Log Section */}
      <section aria-labelledby="build-log-heading">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              <Terminal className="w-3.5 h-3.5" />
              <span>Section 03</span>
            </div>
            <h2 id="build-log-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#171717]">
              The Build Log
            </h2>
            <p className="text-sm text-[#737373]">
              Notes from software architecture, interface design, tool selection, and the messy reality of shipping products.
            </p>
          </div>
          <Link
            to="/category/build-log"
            className="hidden sm:flex text-xs font-semibold text-[#14213D] hover:text-[#3B82F6] items-center gap-1"
          >
            <span>Browse section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {buildLogStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* H. Startups & Business Section */}
      <section aria-labelledby="startups-business-heading">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E5E5E5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Section 04</span>
            </div>
            <h2 id="startups-business-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#171717]">
              Startups & Business
            </h2>
            <p className="text-sm text-[#737373]">
              Fintech rails, African technology pioneers, unit economic realities, and sustainable business models.
            </p>
          </div>
          <Link
            to="/category/startups-business"
            className="hidden sm:flex text-xs font-semibold text-[#14213D] hover:text-[#3B82F6] items-center gap-1"
          >
            <span>Browse section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {startupStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>

      {/* I. Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};
