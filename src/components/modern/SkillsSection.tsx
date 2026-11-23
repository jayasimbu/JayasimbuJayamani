'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Layout,
  Server,
  Database,
  Brain,
  Palette,
  Wrench,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { SKILL_CATEGORIES, SkillCategory } from '@/data/portfolio-data';

interface SkillsSectionProps {
  skillCategories?: SkillCategory[];
}

export default function SkillsSection({ skillCategories = SKILL_CATEGORIES }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categoryIcons: Record<string, LucideIcon> = {
    'Programming Languages': Code2,
    'Frontend Development': Layout,
    'Backend Development': Server,
    'Databases': Database,
    'Cloud & Tools': Wrench,
    'AI & Machine Learning': Brain,
    'Artificial Intelligence': Brain,
    'UI/UX & Design': Palette,
    'Development Tools': Wrench,
  };

  const accentPalette = [
    { iconBg: 'bg-[#ff6b4a]/10 text-[#ff6b4a]' },
    { iconBg: 'bg-[#7bd0ff]/10 text-[#7bd0ff]' },
    { iconBg: 'bg-[#56d9d8]/10 text-[#56d9d8]' },
  ];

  const categories = ['All', ...skillCategories.map((c) => c.name)];

  const displayedCategories =
    activeCategory === 'All'
      ? skillCategories
      : skillCategories.filter((c) => c.name === activeCategory);

  return (
    <section id="skills" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#f6ddd8]">
            Technical <span className="gradient-text-secondary">Skills</span>
          </h2>
        </motion.div>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="tablist" aria-label="Filter skills by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`px-4 py-2 min-h-[40px] rounded-full text-xs font-['JetBrains_Mono'] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b4a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d100e] ${
                activeCategory === cat
                  ? 'bg-[#ff6b4a] text-[#661000] font-semibold shadow-md shadow-[#ff6b4a]/20'
                  : 'bg-[#2a1c19] text-[#e1bfb8] border border-[#59413c]/40 hover:border-[#ffb4a3] hover:text-[#f6ddd8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedCategories.map((group, idx) => {
              const IconComp = categoryIcons[group.name] || Sparkles;
              const palette = accentPalette[idx % accentPalette.length];
              return (
                <motion.div
                  key={group.name}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl p-6 hover-lift flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${palette.iconBg}`}>
                        <IconComp className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk'] text-[17px] font-semibold text-[#f6ddd8]">
                          {group.name}
                        </h3>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#a88a83]">
                          {group.skills.length} competencies
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#261815] border border-[#59413c]/35 hover:border-[#ff6b4a]/40 transition-colors"
                        >
                          <span className="text-xs sm:text-sm text-[#f6ddd8] font-medium">{skill.name}</span>
                          {skill.badge && (
                            <span className="font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded-full bg-[#352723] text-[#e1bfb8] border border-[#59413c]/30">
                              {skill.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
