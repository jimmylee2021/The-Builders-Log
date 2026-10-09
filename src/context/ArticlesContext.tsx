import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article } from '../types';
import { ARTICLES as DEFAULT_ARTICLES } from '../data/articles';

interface ArticlesContextType {
  articles: Article[];
  getArticle: (slug: string) => Article | undefined;
  addArticle: (newArticle: Omit<Article, 'id'>) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleFeatured: (id: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'the_builders_log_articles_v1';

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const ArticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse articles from localStorage, using defaults.', e);
    }
    return DEFAULT_ARTICLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
  }, [articles]);

  const getArticle = (slug: string) => {
    return articles.find((a) => a.slug === slug);
  };

  const addArticle = (newArticleData: Omit<Article, 'id'>) => {
    const id = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const created: Article = {
      ...newArticleData,
      id,
    };
    setArticles((prev) => [created, ...prev]);
    return created;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a))
    );
  };

  const resetToDefaults = () => {
    setArticles(DEFAULT_ARTICLES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        getArticle,
        addArticle,
        updateArticle,
        deleteArticle,
        toggleFeatured,
        resetToDefaults,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
};
