import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../data/categories';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5E5E5] text-[#171717] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Column 1: Brand & Editorial Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block font-heading font-extrabold text-2xl tracking-tight text-[#14213D]">
              The Builder’s Log
            </Link>
            <p className="text-sm text-[#737373] leading-relaxed max-w-sm">
              Stories, ideas, and lessons from people building with technology. An independent publication dedicated to
              making complex systems, engineering craft, and startup economics accessible and clear.
            </p>
            <div className="pt-2 text-xs text-[#737373]">
              <span>Editorial Office: Remote & Distributed</span>
              <span className="mx-2">·</span>
              <span>Updated Weekly</span>
            </div>
          </div>

          {/* Column 2: Sections & Categories */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">
              Sections
            </p>
            <ul className="space-y-2 text-sm text-[#737373]">
              {CATEGORY_LIST.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-[#171717] transition-colors hover:underline underline-offset-4"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: More Categories */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">
              Perspectives
            </p>
            <ul className="space-y-2 text-sm text-[#737373]">
              {CATEGORY_LIST.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-[#171717] transition-colors hover:underline underline-offset-4"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="hover:text-[#171717] transition-colors hover:underline underline-offset-4"
                >
                  Search Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Publication & Info */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">
              Publication
            </p>
            <ul className="space-y-2 text-sm text-[#737373]">
              <li>
                <Link to="/about" className="hover:text-[#171717] transition-colors hover:underline underline-offset-4">
                  About & Principles
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#171717] transition-colors hover:underline underline-offset-4 text-[#14213D] font-semibold">
                  Post Manager (Admin)
                </Link>
              </li>
              <li>
                <a
                  href="#newsletter-section"
                  className="hover:text-[#171717] transition-colors hover:underline underline-offset-4"
                >
                  Newsletter Dispatch
                </a>
              </li>
              <li>
                <a
                  href="mailto:editorial@thebuilderslog.example"
                  className="hover:text-[#171717] transition-colors hover:underline underline-offset-4"
                >
                  Editorial Inquiries
                </a>
              </li>
              <li>
                <span className="text-[#a3a3a3]">RSS Feed (Atom XML)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <p>
            © {currentYear} The Builder’s Log. All rights reserved. Built for curious minds everywhere.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171717] transition-colors"
            >
              X / Twitter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171717] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171717] transition-colors"
            >
              LinkedIn
            </a>
            <Link to="/about" className="hover:text-[#171717] transition-colors">
              Privacy & Ethics
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
