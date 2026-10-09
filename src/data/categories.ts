import { CategoryInfo, CategorySlug } from '../types';

export const CATEGORIES: Record<CategorySlug, CategoryInfo> = {
  'tech-explained': {
    slug: 'tech-explained',
    name: 'Tech Explained',
    tagline: 'How the everyday systems underpinning modern life actually operate.',
    description:
      'Clear, accessible deep-dives into compression algorithms, undersea fiber cables, orbital GPS satellites, encryption, and the fundamental mechanics behind the digital world.',
  },
  'ai-emerging-tech': {
    slug: 'ai-emerging-tech',
    name: 'AI & Emerging Tech',
    tagline: 'Practical realities beyond the hype cycle.',
    description:
      'Thoughtful analysis of frontier models, neural architectures, autonomous agents, robotics, and the practical economic limits of artificial intelligence.',
  },
  'build-log': {
    slug: 'build-log',
    name: 'Build Log',
    tagline: 'Field notes from the workshop of digital craftsmanship.',
    description:
      'Reflections on product engineering, architecture trade-offs, interface craft, refactoring hard systems, and what breaks when prototypes meet real users.',
  },
  'startups-business': {
    slug: 'startups-business',
    name: 'Startups & Business',
    tagline: 'The economics, units, and distribution of technology companies.',
    description:
      'Investigating startup business models, payment infrastructures, African tech ecosystems, unit economics, and how sustainable tech enterprises survive.',
  },
  'careers': {
    slug: 'careers',
    name: 'Careers & Learning',
    tagline: 'Cultivating craft, navigating seniority, and lifelong technical curiosity.',
    description:
      'Guides and essays on transitioning into technology, engineering discipline, mentoring, avoiding burnout, and mastering complex mental models.',
  },
  'perspectives': {
    slug: 'perspectives',
    name: 'Perspectives',
    tagline: 'Essays, ethics, and long-form cultural critique.',
    description:
      'Critical viewpoints on privacy, surveillance, open-source governance, digital labor, and how technology reshapes human culture.',
  },
};

export const CATEGORY_LIST: CategoryInfo[] = Object.values(CATEGORIES);
