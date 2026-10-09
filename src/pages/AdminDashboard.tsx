import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Star,
  RotateCcw,
  Download,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Clock,
  ArrowUpDown,
  AlertTriangle,
} from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { Article, CategorySlug } from '../types';
import { CATEGORY_LIST } from '../data/categories';
import { PostEditorModal } from '../components/PostEditorModal';

export const AdminDashboard: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleFeatured,
    resetToDefaults,
  } = useArticles();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'standard'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'read-time'>('date-desc');

  // Modal states
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Confirmation dialog state
  const [deleteCandidate, setDeleteCandidate] = useState<Article | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics computation (tabular numerals)
  const metrics = useMemo(() => {
    const total = articles.length;
    const featuredCount = articles.filter((a) => a.featured).length;
    const uniqueCategories = new Set(articles.map((a) => a.category)).size;
    const avgMinutes =
      total > 0
        ? Math.round(
            articles.reduce((acc, a) => acc + parseInt(a.readTime, 10) || 5, 0) / total
          )
        : 0;

    return { total, featuredCount, uniqueCategories, avgMinutes };
  }, [articles]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => {
        // Search
        if (searchTerm.trim()) {
          const s = searchTerm.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(s);
          const matchSlug = a.slug.toLowerCase().includes(s);
          const matchAuthor = a.author.name.toLowerCase().includes(s);
          const matchCat = a.categoryName.toLowerCase().includes(s);
          if (!matchTitle && !matchSlug && !matchAuthor && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && a.category !== selectedCategory) {
          return false;
        }

        // Featured filter
        if (featuredFilter === 'featured' && !a.featured) return false;
        if (featuredFilter === 'standard' && a.featured) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'read-time') {
          const rA = parseInt(a.readTime, 10) || 0;
          const rB = parseInt(b.readTime, 10) || 0;
          return rB - rA;
        }
        // Default date sorting
        return 0; // maintain list order
      });
  }, [articles, searchTerm, selectedCategory, featuredFilter, sortBy]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setEditorModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setEditorModalOpen(true);
  };

  const handleSaveArticle = (articleData: Omit<Article, 'id'>) => {
    if (editingArticle) {
      updateArticle(editingArticle.id, articleData);
      showToast(`Updated story: "${articleData.title.slice(0, 30)}..."`);
    } else {
      addArticle(articleData);
      showToast(`Published new story: "${articleData.title.slice(0, 30)}..."`);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      deleteArticle(deleteCandidate.id);
      showToast(`Deleted story: "${deleteCandidate.title.slice(0, 30)}..."`);
      setDeleteCandidate(null);
    }
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    showToast('Reset catalog to default seed articles.');
    setResetConfirmOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `builders_log_articles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported articles JSON backup.');
  };

  return (
    <div className="space-y-8 pt-2 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14213D] text-white px-4 py-3 rounded shadow-lg border border-white/20 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-[#E5E5E5] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-2 font-mono">
            <Link to="/" className="hover:text-[#171717] transition-colors">
              The Builder’s Log
            </Link>
            <span>/</span>
            <span className="text-[#14213D] font-semibold">Editorial Admin</span>
            <span>/</span>
            <span>Post Management</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#171717] tracking-tight">
            Editorial Post Manager
          </h1>
          <p className="text-sm text-[#737373] mt-1">
            Author, edit, feature, and organize articles published across the magazine.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-semibold text-[#14213D] bg-white border border-[#E5E5E5] hover:bg-[#F8F7F3] rounded transition-colors flex items-center gap-1.5"
            title="Download JSON copy of all articles"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-[#737373] hover:text-[#171717] bg-white border border-[#E5E5E5] hover:bg-[#F8F7F3] rounded transition-colors flex items-center gap-1.5"
            title="Restore original seed articles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#14213D] hover:bg-[#1e325c] rounded transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Tabular Figures) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E5] p-5 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <span>Total Published</span>
            <FileText className="w-4 h-4 text-[#a3a3a3]" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#14213D] tabular-nums">
            {metrics.total}
          </p>
          <p className="text-[11px] text-[#737373]">Active stories in catalog</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-5 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <span>Featured Covers</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#14213D] tabular-nums">
            {metrics.featuredCount}
          </p>
          <p className="text-[11px] text-[#737373]">Promoted on front shelves</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-5 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <span>Active Categories</span>
            <Layers className="w-4 h-4 text-[#a3a3a3]" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#14213D] tabular-nums">
            {metrics.uniqueCategories} / {CATEGORY_LIST.length}
          </p>
          <p className="text-[11px] text-[#737373]">Editorial coverage sections</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-5 rounded-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <span>Average Read</span>
            <Clock className="w-4 h-4 text-[#a3a3a3]" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#14213D] tabular-nums">
            {metrics.avgMinutes} min
          </p>
          <p className="text-[11px] text-[#737373]">Editorial depth metric</p>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-[#E5E5E5] p-4 rounded-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, author, slug, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#171717] bg-[#F8F7F3] border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F7F3] border border-[#E5E5E5] rounded text-[#171717] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORY_LIST.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Featured Status */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F7F3] border border-[#E5E5E5] rounded text-[#171717] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="featured">Featured Stories Only</option>
            <option value="standard">Standard Stories Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F7F3] border border-[#E5E5E5] rounded text-[#171717] focus:outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="read-time">Read Time (Longest)</option>
          </select>

          {(searchTerm || selectedCategory !== 'all' || featuredFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setFeaturedFilter('all');
              }}
              className="text-xs text-[#3B82F6] hover:underline px-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* High-density Data Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F7F3] border-b border-[#E5E5E5] text-[#737373] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">Featured</th>
                <th className="py-3 px-4">Article Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4 tabular-nums">Date</th>
                <th className="py-3 px-4 tabular-nums">Read Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-[#F8F7F3]/70 transition-colors group"
                  >
                    {/* Featured toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(article.id)}
                        className="p-1 hover:bg-white rounded transition-colors"
                        title={article.featured ? 'Unfeature article' : 'Mark as featured cover story'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            article.featured
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-[#d4d4d4] group-hover:text-[#a3a3a3]'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded overflow-hidden bg-[#EAE8E1] shrink-0 border border-[#E5E5E5]">
                          <img
                            src={article.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5 truncate">
                          <p className="font-heading font-semibold text-sm text-[#171717] truncate group-hover:text-[#14213D]">
                            {article.title}
                          </p>
                          <p className="text-[11px] font-mono text-[#737373] truncate">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs text-[#3B82F6] font-medium">
                        {article.categoryName}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-[#171717] font-medium">{article.author.name}</p>
                      <p className="text-[10px] text-[#737373]">{article.author.role}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#737373] tabular-nums">
                      {article.date}
                    </td>

                    {/* Read Time */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#737373] tabular-nums">
                      {article.readTime}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/article/${article.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#737373] hover:text-[#14213D] rounded hover:bg-white border border-transparent hover:border-[#E5E5E5]"
                          title="View live article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(article)}
                          className="p-1.5 text-[#737373] hover:text-[#14213D] rounded hover:bg-white border border-transparent hover:border-[#E5E5E5]"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(article)}
                          className="p-1.5 text-[#737373] hover:text-rose-600 rounded hover:bg-white border border-transparent hover:border-[#E5E5E5]"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center text-[#737373] space-y-2">
                    <p className="font-semibold text-sm text-[#171717]">No articles matched criteria</p>
                    <p className="text-xs">Try clearing filters or search keywords.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-[#F8F7F3] border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
          <span>
            Showing <strong className="text-[#171717]">{filteredArticles.length}</strong> of{' '}
            <strong className="text-[#171717]">{articles.length}</strong> total stories
          </span>
          <span className="font-mono text-[11px]">Storage: LocalStorage Active</span>
        </div>
      </div>

      {/* Post Editor Modal */}
      <PostEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        onSave={handleSaveArticle}
        initialArticle={editingArticle}
      />

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-sm border border-[#E5E5E5] p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-[#171717]">
                  Delete Story?
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-[#171717]">"{deleteCandidate.title}"</strong>? This will remove
                  the article from the homepage, categories, and search index.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-3 py-1.5 text-xs text-[#737373] hover:text-[#171717]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-sm border border-[#E5E5E5] p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-[#171717]">
                  Reset to Seed Stories?
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  This will reset all articles back to the 12+ default editorial seed stories and clear any
                  custom posts you authored in this browser.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-[#737373] hover:text-[#171717]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#14213D] hover:bg-[#1e325c] rounded transition-colors"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
