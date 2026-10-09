import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/category/tech-explained', label: 'Tech Explained' },
    { to: '/category/ai-emerging-tech', label: 'AI & Emerging Tech' },
    { to: '/category/build-log', label: 'Build Log' },
    { to: '/category/startups-business', label: 'Startups & Business' },
    { to: '/category/careers', label: 'Careers' },
    { to: '/category/perspectives', label: 'Perspectives' },
  ];

  const handleNewsletterClick = () => {
    const newsletterEl = document.getElementById('newsletter-section');
    if (newsletterEl) {
      newsletterEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#newsletter-section');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[#E5E5E5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#171717] group-hover:text-[#14213D] transition-colors">
                The Builder’s Log
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#737373] hidden sm:block -mt-1 font-body">
                Technology & Craft Journal
              </span>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#737373] whitespace-nowrap">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `transition-colors hover:text-[#171717] relative py-1 ${
                    isActive
                      ? 'text-[#171717] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#14213D]'
                      : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Search, Newsletter, & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch ? onOpenSearch : () => navigate('/search')}
              className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E5E5] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Search articles"
              title="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Newsletter CTA Button */}
            <button
              type="button"
              onClick={handleNewsletterClick}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-[#14213D] bg-white border border-[#E5E5E5] hover:border-[#14213D] hover:bg-[#14213D] hover:text-white rounded transition-colors whitespace-nowrap shadow-xs"
            >
              Newsletter
            </button>

            {/* Admin Dashboard Entry */}
            <Link
              to="/admin"
              className="hidden lg:inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-[#737373] hover:text-[#14213D] hover:bg-white border border-transparent hover:border-[#E5E5E5] rounded transition-colors whitespace-nowrap"
              title="Editorial Post Manager Dashboard"
            >
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#171717] hover:bg-white rounded-md border border-[#E5E5E5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#E5E5E5] bg-[#FFFFFF] px-4 pt-3 pb-6 animate-fadeIn shadow-sm">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F8F7F3] text-[#14213D] font-bold border-l-2 border-[#14213D]'
                      : 'text-[#737373] hover:bg-[#F8F7F3] hover:text-[#171717]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="pt-3 mt-2 border-t border-[#E5E5E5] flex flex-col gap-2">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#737373] hover:text-[#171717]"
              >
                About The Publication
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#14213D] font-medium hover:bg-[#F8F7F3] rounded"
              >
                Editorial Admin Dashboard
              </Link>
              <button
                type="button"
                onClick={handleNewsletterClick}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-white bg-[#14213D] rounded hover:bg-[#1e325c] transition-colors"
              >
                <span>Subscribe to Newsletter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
