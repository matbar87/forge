import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../translations';
import { RETREAT_GALLERY } from '../data/gallery';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang].about;
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const draggedDistance = useRef(0);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      updateScrollState();
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImageIndex(null);
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + RETREAT_GALLERY.length) % RETREAT_GALLERY.length : null));
      }
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % RETREAT_GALLERY.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex]);

  const scrollByAmount = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    draggedDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    draggedDistance.current = Math.abs(walk);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (index: number) => {
    // Only open lightbox if not dragging
    if (draggedDistance.current < 8) {
      setActiveImageIndex(index);
    }
  };

  const activeImage = activeImageIndex !== null ? RETREAT_GALLERY[activeImageIndex] : null;

  return (
    <section id="meski-wyjazd" className="py-28 bg-transparent relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag - No borders */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ 01 // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        {/* Massive Headline */}
        <div className="mb-14">
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9]">
            {lang === 'pl' ? 'NIE ZWYKŁY WYJAZD.' : 'NOT A CASUAL CAMP.'} <br />
            <span className="text-[#E3E6DB]/60">
              {lang === 'pl' ? 'CZAS HARTOWANIA STALI.' : 'A CRUCIBLE OF CHARACTER.'}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-[#E3E6DB]/80 font-medium max-w-3xl mt-6 leading-relaxed">
            {t.lead}
          </p>
        </div>

        {/* Narrative & Pillars Bento Grid - Borderless */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24 items-stretch">
          {/* Main Manifesto Card - Borderless */}
          <div className="lg:col-span-8 bg-[#18212C] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-6 text-[#E3E6DB]/80 text-base sm:text-lg leading-relaxed relative z-10">
              <p className="font-normal text-[#E3E6DB]">
                {t.descriptionParagraph1}
              </p>
              <p className="font-normal text-[#E3E6DB]/70">
                {t.descriptionParagraph2}
              </p>
            </div>

            {/* Scripture Quote Box - Borderless, soft background */}
            <div className="mt-10 pt-8 border-t border-[#3E4C5E]/30 relative z-10">
              <div className="flex items-start gap-4">
                <span className="font-bebas text-5xl text-[#3E4C5E] leading-none select-none">“</span>
                <div>
                  <p className="text-lg sm:text-xl font-medium text-[#E3E6DB] italic leading-snug">
                    {t.quote}
                  </p>
                  <span className="text-xs font-mono-code tracking-wider text-[#E3E6DB]/50 uppercase mt-2 block font-semibold">
                    // {lang === 'pl' ? 'KSIĘGA PRZYSŁÓW 27:17' : 'PROVERBS 27:17'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Column - Borderless */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {t.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[#18212C] rounded-3xl p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden shadow-xl hover:bg-[#202B39] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-xs text-[#E3E6DB]/60 uppercase font-bold tracking-wider">
                    // 0{idx + 1}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3E4C5E]" />
                </div>
                <span className="font-bebas text-4xl sm:text-5xl text-[#E3E6DB] tracking-wide">
                  {stat.value}
                </span>
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#E3E6DB]/60 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Modern Photo Stream - Horizontal sliding vertical fragments, no labels/text */}
        <div className="relative">
          {/* Slider Navigation Buttons - Aligned right without redundant heading */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <button
              onClick={() => scrollByAmount(-360)}
              disabled={!canScrollLeft}
              className={`p-3 rounded-2xl transition-all shadow-lg ${
                canScrollLeft
                  ? 'bg-[#18212C] text-[#E3E6DB] hover:bg-[#253242] active:scale-95'
                  : 'bg-[#18212C]/40 text-[#E3E6DB]/20 cursor-not-allowed'
              }`}
              aria-label="Previous photos"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollByAmount(360)}
              disabled={!canScrollRight}
              className={`p-3 rounded-2xl transition-all shadow-lg ${
                canScrollRight
                  ? 'bg-[#18212C] text-[#E3E6DB] hover:bg-[#253242] active:scale-95'
                  : 'bg-[#18212C]/40 text-[#E3E6DB]/20 cursor-not-allowed'
              }`}
              aria-label="Next photos"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Horizontal Scroll Track with Vertical Slices & Accordion Parallax */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing select-none scroll-smooth"
          >
            {RETREAT_GALLERY.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(index)}
                className="group relative h-[460px] sm:h-[540px] md:h-[600px] w-[220px] sm:w-[260px] md:w-[290px] shrink-0 rounded-3xl overflow-hidden bg-[#18212C] shadow-2xl cursor-pointer transition-all duration-700 ease-out hover:w-[320px] sm:hover:w-[380px] md:hover:w-[420px]"
              >
                {/* Clean Photo with Zoom / Parallax Shift */}
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover filter brightness-90 contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-115 group-hover:brightness-105 pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />

                {/* Ambient Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121820]/80 via-transparent to-[#121820]/30 opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                {/* Minimalist Floating Expand Button on Hover - Completely Text-Free */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end items-end pointer-events-none">
                  <div className="w-11 h-11 rounded-2xl bg-[#121820]/80 backdrop-blur-md flex items-center justify-center text-[#E3E6DB] shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Maximize2 className="w-5 h-5 text-[#E3E6DB]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Minimalist Scroll Progress Track */}
          <div className="mt-6 w-full h-1 bg-[#18212C] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E3E6DB]/40 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Full-Photo Lightbox Modal - Completely Clean, Full View, No Labels/Text */}
      {activeImage && (
        <div
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#0E131A]/95 backdrop-blur-2xl animate-fade-in select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 p-3.5 rounded-full bg-[#18212C] text-[#E3E6DB] hover:bg-[#253242] transition-colors z-30 shadow-2xl"
            aria-label="Close image modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + RETREAT_GALLERY.length) % RETREAT_GALLERY.length : null));
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-[#18212C]/90 text-[#E3E6DB] hover:bg-[#253242] transition-colors z-30 shadow-2xl"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % RETREAT_GALLERY.length : null));
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-[#18212C]/90 text-[#E3E6DB] hover:bg-[#253242] transition-colors z-30 shadow-2xl"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content - Entire, Full Image Displayed with Zero Text */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-7xl max-h-[92vh] flex items-center justify-center p-2"
          >
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[88vh] max-w-[92vw] w-auto h-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
