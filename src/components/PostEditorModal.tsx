import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, Edit3, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Article, ArticleSection, CategorySlug } from '../types';
import { CATEGORY_LIST } from '../data/categories';
import heroCompressionImg from '../assets/images/hero_compression_data_1791546088215.jpg';
import underseaCablesImg from '../assets/images/undersea_cables_internet_1791546099761.jpg';
import fintechPaymentsImg from '../assets/images/fintech_mobile_payments_1791546111634.jpg';
import aiChipsImg from '../assets/images/ai_agents_chips_1791546122269.jpg';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: Omit<Article, 'id'>) => void;
  initialArticle?: Article | null;
}

const PRESET_IMAGES = [
  { label: 'Data Compression Sculpture', url: heroCompressionImg },
  { label: 'Undersea Fiber Cables', url: underseaCablesImg },
  { label: 'African Mobile Money', url: fintechPaymentsImg },
  { label: 'Silicon AI Architecture', url: aiChipsImg },
];

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}) => {
  const isEditing = Boolean(initialArticle);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<CategorySlug>('tech-explained');
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('Editorial Staff');
  const [authorRole, setAuthorRole] = useState('Staff Columnist');
  const [date, setDate] = useState('Oct 09, 2026');
  const [readTime, setReadTime] = useState('6 min read');
  const [coverImage, setCoverImage] = useState(heroCompressionImg);
  const [coverImageCaption, setCoverImageCaption] = useState('');
  const [featured, setFeatured] = useState(false);
  const [tagsString, setTagsString] = useState('Technology, Engineering');

  // Sections
  const [sections, setSections] = useState<ArticleSection[]>([
    {
      heading: 'Introduction',
      content: ['Write the opening paragraph here.'],
    },
  ]);

  // Errors
  const [errorMsg, setErrorMsg] = useState('');

  // Populate on open
  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title);
      setSlug(initialArticle.slug);
      setCategory(initialArticle.category);
      setExcerpt(initialArticle.excerpt);
      setAuthorName(initialArticle.author.name);
      setAuthorRole(initialArticle.author.role);
      setDate(initialArticle.date);
      setReadTime(initialArticle.readTime);
      setCoverImage(initialArticle.coverImage);
      setCoverImageCaption(initialArticle.coverImageCaption || '');
      setFeatured(Boolean(initialArticle.featured));
      setTagsString(initialArticle.tags.join(', '));
      setSections(initialArticle.sections.length > 0 ? initialArticle.sections : [
        { heading: 'Introduction', content: [''] },
      ]);
    } else {
      // Defaults for new post
      setTitle('');
      setSlug('');
      setCategory('tech-explained');
      setExcerpt('');
      setAuthorName('Editorial Staff');
      setAuthorRole('Staff Columnist');
      setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      setReadTime('5 min read');
      setCoverImage(heroCompressionImg);
      setCoverImageCaption('');
      setFeatured(false);
      setTagsString('Technology, Explainers');
      setSections([
        {
          heading: 'The Core Premise',
          content: [
            'Every complex system begins with a foundational question that reveals the mechanics beneath the surface.',
          ],
        },
      ]);
    }
    setErrorMsg('');
    setActiveTab('editor');
  }, [initialArticle, isOpen]);

  // Auto-generate slug from title if not manually edited during create
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Auto calculate read time based on word count
  const handleAutoCalculateReadTime = () => {
    const totalWords =
      sections.reduce((acc, s) => acc + s.content.join(' ').split(/\s+/).length, 0) +
      title.split(/\s+/).length +
      excerpt.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    setReadTime(`${minutes} min read`);
  };

  // Section helpers
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        heading: 'New Section',
        content: [''],
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionHeadingChange = (idx: number, heading: string) => {
    setSections(
      sections.map((s, i) => (i === idx ? { ...s, heading } : s))
    );
  };

  const handleSectionContentChange = (idx: number, text: string) => {
    const paragraphs = text.split('\n\n').filter(Boolean);
    setSections(
      sections.map((s, i) => (i === idx ? { ...s, content: paragraphs.length > 0 ? paragraphs : [''] } : s))
    );
  };

  const handleAddQuoteToSection = (idx: number) => {
    setSections(
      sections.map((s, i) =>
        i === idx
          ? {
              ...s,
              quote: s.quote ? undefined : { text: 'Key quote text here...', citation: 'Author or Source' },
            }
          : s
      )
    );
  };

  const handleAddCodeToSection = (idx: number) => {
    setSections(
      sections.map((s, i) =>
        i === idx
          ? {
              ...s,
              codeBlock: s.codeBlock
                ? undefined
                : {
                    language: 'typescript',
                    code: '// Sample code or data representation\nfunction process() {\n  return true;\n}',
                    caption: 'Code example',
                  },
            }
          : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please specify a URL slug.');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMsg('Please provide a short excerpt deck.');
      return;
    }

    const categoryObj = CATEGORY_LIST.find((c) => c.slug === category);
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      categoryName: categoryObj ? categoryObj.name : 'Tech Explained',
      author: {
        name: authorName.trim() || 'Editorial Staff',
        role: authorRole.trim() || 'Staff Writer',
      },
      date: date.trim() || 'Oct 09, 2026',
      readTime: readTime.trim() || '5 min read',
      featured,
      coverImage: coverImage.trim() || heroCompressionImg,
      coverImageCaption: coverImageCaption.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Technology'],
      sections: sections.map((s) => ({
        ...s,
        content: s.content.length > 0 ? s.content : [''],
      })),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div
        className="w-full max-w-4xl bg-[#FFFFFF] rounded-sm shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F8F7F3]">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#14213D]">
              {isEditing ? `Edit Story: ${initialArticle?.title.slice(0, 35)}...` : 'Create New Editorial Story'}
            </h3>
            <p className="text-xs text-[#737373]">
              The Builder’s Log Editorial Publishing Desk
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-white border border-[#E5E5E5] p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'editor' ? 'bg-[#14213D] text-white' : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-[#14213D] text-white' : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#737373] hover:text-[#171717] rounded hover:bg-white border border-transparent hover:border-[#E5E5E5]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'editor' ? (
            <form id="post-editor-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How Distributed Hash Tables Actually Function"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="how-distributed-hash-tables-work"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                  />
                </div>
              </div>

              {/* Row 2: Category, Date, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategorySlug)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                  >
                    {CATEGORY_LIST.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Oct 09, 2026"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                      Reading Time
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCalculateReadTime}
                      className="text-[10px] text-[#3B82F6] hover:underline"
                    >
                      Estimate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="6 min read"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                  />
                </div>
              </div>

              {/* Row 3: Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                  Story Deck / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Concise 1-2 sentence hook explaining what reader will learn..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                />
              </div>

              {/* Row 4: Author Info & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#F8F7F3] p-4 rounded border border-[#E5E5E5]">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="Staff Systems Editor"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded"
                  />
                </div>

                <div className="sm:col-span-3 pt-4 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14213D]">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#14213D] focus:ring-[#14213D]"
                    />
                    <span>Featured Cover Story</span>
                  </label>
                </div>
              </div>

              {/* Row 5: Imagery */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                  Cover Image
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setCoverImage(img.url)}
                      className={`relative aspect-16/10 rounded overflow-hidden border text-left group ${
                        coverImage === img.url
                          ? 'border-[#14213D] ring-2 ring-[#14213D]'
                          : 'border-[#E5E5E5] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 p-1 flex items-end">
                        <span className="text-[10px] text-white line-clamp-1">{img.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image URL"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5E5E5] rounded"
                />

                <input
                  type="text"
                  value={coverImageCaption}
                  onChange={(e) => setCoverImageCaption(e.target.value)}
                  placeholder="Cover photo caption or credit..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5E5] rounded"
                />
              </div>

              {/* Row 6: Tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#14213D]">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="Algorithms, Infrastructure, Data Structures"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded"
                />
              </div>

              {/* Row 7: Dynamic Article Sections */}
              <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base text-[#14213D]">
                    Article Narrative Sections ({sections.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#14213D] text-white rounded hover:bg-[#1e325c]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-[#E5E5E5] rounded-sm space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                          Section {idx + 1}
                        </span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-xs text-rose-600 hover:text-rose-800 p-1"
                            title="Delete section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={sec.heading || ''}
                        onChange={(e) => handleSectionHeadingChange(idx, e.target.value)}
                        placeholder={`Section ${idx + 1} Heading...`}
                        className="w-full px-3 py-1.5 text-sm font-semibold text-[#171717] bg-[#F8F7F3] border border-[#E5E5E5] rounded"
                      />

                      <textarea
                        rows={4}
                        value={sec.content.join('\n\n')}
                        onChange={(e) => handleSectionContentChange(idx, e.target.value)}
                        placeholder="Write paragraphs. Separate multiple paragraphs with a double line break."
                        className="w-full px-3 py-2 text-sm text-[#262626] bg-white border border-[#E5E5E5] rounded"
                      />

                      {/* Section Add-ons (Quote, Code) */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => handleAddQuoteToSection(idx)}
                          className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                            sec.quote
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-[#E5E5E5] text-[#737373] hover:text-[#171717]'
                          }`}
                        >
                          {sec.quote ? '✓ Pull Quote Attached' : '+ Add Pull Quote'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddCodeToSection(idx)}
                          className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                            sec.codeBlock
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-[#E5E5E5] text-[#737373] hover:text-[#171717]'
                          }`}
                        >
                          {sec.codeBlock ? '✓ Code Block Attached' : '+ Add Code Snippet'}
                        </button>
                      </div>

                      {sec.quote && (
                        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded text-xs space-y-2">
                          <input
                            type="text"
                            value={sec.quote.text}
                            onChange={(e) => {
                              const updated = [...sections];
                              if (updated[idx].quote) {
                                updated[idx].quote!.text = e.target.value;
                                setSections(updated);
                              }
                            }}
                            placeholder="Quote text..."
                            className="w-full px-2 py-1 bg-white border border-amber-300 rounded"
                          />
                          <input
                            type="text"
                            value={sec.quote.citation || ''}
                            onChange={(e) => {
                              const updated = [...sections];
                              if (updated[idx].quote) {
                                updated[idx].quote!.citation = e.target.value;
                                setSections(updated);
                              }
                            }}
                            placeholder="Citation (e.g. Claude Shannon, 1948)..."
                            className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-[11px]"
                          />
                        </div>
                      )}

                      {sec.codeBlock && (
                        <div className="p-3 bg-[#14213D] text-white rounded text-xs space-y-2 font-mono">
                          <textarea
                            rows={3}
                            value={sec.codeBlock.code}
                            onChange={(e) => {
                              const updated = [...sections];
                              if (updated[idx].codeBlock) {
                                updated[idx].codeBlock!.code = e.target.value;
                                setSections(updated);
                              }
                            }}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Live Editorial Preview */
            <div className="max-w-2xl mx-auto space-y-8 bg-white p-6 sm:p-8 border border-[#E5E5E5] rounded">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                <span>{CATEGORY_LIST.find((c) => c.slug === category)?.name}</span>
                <span>·</span>
                <span>{readTime}</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl text-[#171717] tracking-tight leading-tight">
                {title || 'Untitled Story Headline'}
              </h1>

              <p className="text-lg text-[#737373] font-body leading-relaxed">
                {excerpt || 'The excerpt summary will appear here.'}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#737373] pb-4 border-b border-[#E5E5E5]">
                <span className="font-bold text-[#171717]">{authorName}</span>
                <span>·</span>
                <span>{date}</span>
              </div>

              {coverImage && (
                <div className="aspect-16/9 overflow-hidden rounded bg-[#EAE8E1]">
                  <img src={coverImage} alt="Preview cover" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-6 text-[#262626] font-body leading-relaxed">
                {sections.map((s, idx) => (
                  <div key={idx} className="space-y-3">
                    {s.heading && (
                      <h2 className="font-heading font-bold text-2xl text-[#171717]">{s.heading}</h2>
                    )}
                    {s.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                    {s.quote && (
                      <blockquote className="my-4 p-4 border-l-2 border-[#14213D] bg-[#F8F7F3] italic font-heading">
                        “{s.quote.text}”
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F8F7F3] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#737373] hover:text-[#171717] rounded hover:bg-white border border-transparent hover:border-[#E5E5E5]"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="post-editor-form"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#14213D] hover:bg-[#1e325c] rounded transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Publish Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
