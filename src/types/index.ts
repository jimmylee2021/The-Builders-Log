export type CategorySlug =
  | 'tech-explained'
  | 'ai-emerging-tech'
  | 'build-log'
  | 'startups-business'
  | 'careers'
  | 'perspectives';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  tagline: string;
}

export interface ArticleSection {
  heading?: string;
  content: string[];
  quote?: {
    text: string;
    citation?: string;
  };
  codeBlock?: {
    language: string;
    code: string;
    caption?: string;
  };
  callout?: {
    title: string;
    text: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categoryName: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string; // e.g. "Oct 02, 2026"
  readTime: string; // e.g. "8 min read"
  featured?: boolean;
  coverImage: string;
  coverImageCaption?: string;
  tags: string[];
  sections: ArticleSection[];
}
