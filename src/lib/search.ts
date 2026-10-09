import { Article } from '../types';

export interface SearchResult {
  article: Article;
  matchScore: number;
  matchedFields: string[];
}

export function searchArticles(articles: Article[], query: string): SearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const terms = cleanQuery.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];

  for (const article of articles) {
    let score = 0;
    const matchedFields: string[] = [];

    const titleLower = article.title.toLowerCase();
    const excerptLower = article.excerpt.toLowerCase();
    const categoryLower = article.categoryName.toLowerCase();
    const authorLower = article.author.name.toLowerCase();
    const tagsLower = article.tags.map((t) => t.toLowerCase());
    const contentText = article.sections
      .map((s) => `${s.heading || ''} ${s.content.join(' ')}`)
      .join(' ')
      .toLowerCase();

    // Check full query first
    if (titleLower.includes(cleanQuery)) {
      score += 100;
      matchedFields.push('title');
    }
    if (categoryLower.includes(cleanQuery)) {
      score += 60;
      matchedFields.push('category');
    }
    if (tagsLower.some((t) => t.includes(cleanQuery))) {
      score += 50;
      matchedFields.push('tag');
    }
    if (excerptLower.includes(cleanQuery)) {
      score += 40;
      matchedFields.push('excerpt');
    }
    if (authorLower.includes(cleanQuery)) {
      score += 30;
      matchedFields.push('author');
    }
    if (contentText.includes(cleanQuery)) {
      score += 20;
      matchedFields.push('content');
    }

    // Check individual terms
    for (const term of terms) {
      if (titleLower.includes(term)) score += 15;
      if (categoryLower.includes(term)) score += 10;
      if (tagsLower.some((t) => t.includes(term))) score += 10;
      if (excerptLower.includes(term)) score += 8;
      if (contentText.includes(term)) score += 3;
    }

    if (score > 0) {
      results.push({
        article,
        matchScore: score,
        matchedFields: Array.from(new Set(matchedFields)),
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
