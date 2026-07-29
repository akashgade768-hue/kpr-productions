import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Filter, Star, Quote, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const CATEGORIES = ['All', 'Weddings', 'Portraits', 'Events', 'Commercial', 'Pre-wedding'] as const;

interface PhotographyShowcaseProps {
  onBookSession: () => void;
}

const PhotographyShowcase: React.FC<PhotographyShowcaseProps> = ({ onBookSession }) => {
  const { portfolio, testimonials } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const filtered = activeCategory === 'All'
    ? portfolio
    : portfolio.filter(p => p.category === activeCategory);

  return (
    <section id="photography" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5">
          <Camera size={14} className="text-gold-400" />
          <span className="text-xs tracking-[0.2em] text-gold-300 uppercase font-medium">Photography Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinematic font-bold text-white mb-4">
          Our Featured <span className="text-gold-gradient">Work</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          A curated gallery of our finest moments — each frame is a testament to the emotion, light, and artistry we bring to every project.
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-2 mb-12"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gold-gradient text-black shadow-lg shadow-gold-500/20'
                : 'text-gray-400 border border-dark-border hover:border-gold-500/40 hover:text-white bg-dark-card'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl overflow-hidden break-inside-avoid cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ minHeight: index % 3 === 0 ? '420px' : '320px' }}
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-xs tracking-widest uppercase text-gold-400 mb-1">{item.category}</span>
                <h3 className="text-lg font-serif font-bold text-white">{item.title}</h3>
              </div>
              {item.featured && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-500/40">
                  <Star size={12} className="text-gold-400 inline mr-1" />
                  <span className="text-[10px] text-gold-300 font-medium">FEATURED</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Photographer Profile */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-24 glass-card-gold rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
      >
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
          alt="Lead Photographer"
          className="w-32 h-32 rounded-2xl object-cover border-2 border-gold-500/40 shadow-lg shadow-gold-500/10"
        />
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-cinematic font-bold text-white mb-2">Vikramaditya KPR</h3>
          <p className="text-gold-400 text-sm tracking-wider uppercase mb-3">Lead Cinematographer & Creative Director</p>
          <p className="text-gray-400 leading-relaxed max-w-xl">
            With over 12 years of capturing life's most extraordinary moments, I blend documentary authenticity
            with cinematic artistry. Every wedding, every portrait, every commercial frame is crafted to
            transcend the ordinary and become an heirloom of visual storytelling.
          </p>
        </div>
      </motion.div>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-cinematic font-bold text-center text-white mb-10">
            What Our <span className="text-gold-gradient">Clients</span> Say
          </h3>

          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-8 md:p-10 text-center"
              >
                <Quote size={32} className="text-gold-500/40 mx-auto mb-4" />
                <p className="text-lg md:text-xl text-gray-200 font-serif italic leading-relaxed mb-6">
                  "{testimonials[testimonialIdx].quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  {testimonials[testimonialIdx].avatar_url && (
                    <img
                      src={testimonials[testimonialIdx].avatar_url}
                      alt={testimonials[testimonialIdx].client_name}
                      className="w-10 h-10 rounded-full object-cover border border-gold-500/30"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{testimonials[testimonialIdx].client_name}</p>
                    <p className="text-gold-400 text-xs">{testimonials[testimonialIdx].event_type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full border border-dark-border text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === testimonialIdx ? 'bg-gold-500 w-6' : 'bg-dark-border'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}
                  className="p-2 rounded-full border border-dark-border text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Book a Session CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onBookSession}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gold-gradient rounded-2xl text-black font-semibold text-lg shadow-lg shadow-gold-500/20"
        >
          <Camera size={22} />
          Book a Session
        </motion.button>
      </motion.div>
    </section>
  );
};

export default PhotographyShowcase;
