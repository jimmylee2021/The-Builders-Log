import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Eye, Layers, BookCheck } from 'lucide-react';
import { NewsletterBox } from '../components/NewsletterBox';

export const AboutPage: React.FC = () => {
  const principles = [
    {
      title: 'Curiosity',
      icon: Compass,
      desc: 'We start by asking how things genuinely work beneath the shiny surface. We approach complex systems with eagerness rather than cynicism.',
    },
    {
      title: 'Clarity',
      icon: Eye,
      desc: 'No jargon for the sake of looking clever. Every concept is broken down into intuitive analogies, transparent diagrams, and plain English.',
    },
    {
      title: 'Accuracy',
      icon: ShieldCheck,
      desc: 'We verify mathematical limits, hardware constraints, and historical records. We do not sacrifice technical truth for simplified clicks.',
    },
    {
      title: 'Practical Understanding',
      icon: Layers,
      desc: 'Beyond abstract theories, we examine the real trade-offs of engineering: latency, unit economics, infrastructure maintenance, and human usability.',
    },
    {
      title: 'Responsible Reporting',
      icon: BookCheck,
      desc: 'We reject hype cycles and doom narratives alike. We report on artificial intelligence, cybersecurity, and startups with measured realism.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pt-4 sm:pt-8 max-w-4xl mx-auto">
      {/* Manifesto / Mission */}
      <section className="space-y-6 pb-8 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
          <span>About the Journal</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#171717] tracking-tight leading-tight">
          Technology is everywhere. Understanding it changes everything.
        </h1>

        <div className="text-lg sm:text-xl text-[#262626] font-body leading-relaxed space-y-4 pt-2">
          <p className="font-medium text-[#14213D]">
            The Builder’s Log is a technology publication for curious people. We explore how technology
            works, how products are built, and how innovation creates new possibilities. Through clear
            explainers, thoughtful stories, and practical lessons, we make technology easier to understand.
          </p>
          <p className="text-base text-[#737373] leading-relaxed">
            This is not a blog dedicated solely to code snippets or web development frameworks. We investigate
            the full spectrum of modern digital existence: from the 900,000 miles of undersea fiber cables
            connecting continents to how relativity keeps GPS satellites in sync, from the unit economics of
            African fintech pioneers to the architecture of loss-reduction in compression algorithms.
          </p>
        </div>
      </section>

      {/* Editorial Principles */}
      <section aria-labelledby="principles-heading" className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
            Our Standards
          </p>
          <h2 id="principles-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mt-1">
            Editorial Principles
          </h2>
          <p className="text-sm text-[#737373] mt-2">
            Every piece published in The Builder’s Log is evaluated against five core criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white border border-[#E5E5E5] p-6 rounded-sm space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-[#F8F7F3] text-[#14213D]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#171717]">{p.title}</h3>
                </div>
                <p className="text-sm text-[#737373] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What We Cover */}
      <section aria-labelledby="coverage-heading" className="space-y-6 bg-white border border-[#E5E5E5] p-8 sm:p-10 rounded-sm">
        <h2 id="coverage-heading" className="font-heading font-bold text-2xl text-[#171717]">
          What We Cover
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#737373] leading-relaxed">
          <ul className="space-y-2 list-disc list-inside">
            <li>Technology concepts and explainers</li>
            <li>Artificial intelligence and frontier models</li>
            <li>Cybersecurity, cryptography, and privacy</li>
            <li>Undersea cables, satellites, and physical infrastructure</li>
            <li>Fintech, digital ledgers, and money velocity</li>
          </ul>
          <ul className="space-y-2 list-disc list-inside">
            <li>Startups, business models, and unit economics</li>
            <li>African technology and regional innovations</li>
            <li>Product craftsmanship and software design</li>
            <li>Engineering careers and mental models</li>
            <li>Long-form critique and digital culture</li>
          </ul>
        </div>
      </section>

      {/* Editorial Inquiries & Pitching */}
      <section className="space-y-4 border-t border-[#E5E5E5] pt-10">
        <h2 className="font-heading font-bold text-xl text-[#171717]">
          Writing for The Builder’s Log
        </h2>
        <p className="text-sm text-[#737373] leading-relaxed max-w-2xl">
          We welcome pitches from engineers, researchers, product designers, and independent operators who have
          hands-on experience and a talent for lucid explanation. We value deep practical insight over superficial commentary.
        </p>
        <p className="text-xs text-[#737373]">
          Send story pitches and editorial inquiries to{' '}
          <a
            href="mailto:editorial@thebuilderslog.example"
            className="text-[#14213D] font-semibold underline underline-offset-4 hover:text-[#3B82F6]"
          >
            editorial@thebuilderslog.example
          </a>
        </p>
      </section>

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  );
};
