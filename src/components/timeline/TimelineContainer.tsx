import { useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import timelineData from '../../data/timeline_events.json';
import type { TimelineEvent as TimelineEventType } from '../../types';
import TimelineFilter from './TimelineFilter';
import TimelineEvent from './TimelineEvent';

export default function TimelineContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const prefersReduced = useReducedMotion();

  const events = timelineData as TimelineEventType[];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);

  // Group by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, TimelineEventType[]> = {};
    filteredEvents.forEach(event => {
      const year = event.date.split('-')[0];
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-32">
      <TimelineFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="mt-8 relative">
        {/* Thin vertical progress line */}
        <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-slate-200/50 dark:bg-white/[0.04]" />

        {groupedByYear.map(([year, yearEvents]) => (
          <YearGroup
            key={year}
            year={year}
            events={yearEvents}
            allFiltered={filteredEvents}
            prefersReduced={!!prefersReduced}
          />
        ))}

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-sm text-slate-400 dark:text-white/20 font-light">没有找到匹配的事件</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Year Group with sticky year label ── */
function YearGroup({
  year,
  events,
  allFiltered,
  prefersReduced,
}: {
  year: string;
  events: TimelineEventType[];
  allFiltered: TimelineEventType[];
  prefersReduced: boolean;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: groupRef,
    offset: ['start end', 'end start'],
  });

  // Year label fades in as group enters
  const yearOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0, 1, 1, 0.3]);

  return (
    <div ref={groupRef} className="relative mb-16" style={{ position: 'relative' }}>
      {/* Giant year — sticky, left-aligned, watermark style */}
      <div className="sticky top-20 z-10 pointer-events-none mb-8">
        <motion.div
          style={prefersReduced ? {} : { opacity: yearOpacity }}
          className="flex items-baseline gap-4"
        >
          <span className="text-[clamp(4rem,12vw,8rem)] font-black text-slate-100 dark:text-white/[0.04] leading-none tracking-[-0.04em] select-none">
            {year}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200/60 dark:from-white/[0.04] to-transparent" />
        </motion.div>
      </div>

      {/* Events */}
      <div className="relative pl-6 sm:pl-20 space-y-6">
        {events.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            index={allFiltered.indexOf(event)}
          />
        ))}
      </div>
    </div>
  );
}
