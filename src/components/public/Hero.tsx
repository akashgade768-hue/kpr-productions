import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Printer, ChevronDown, Sparkles, Play } from 'lucide-react';

interface HeroProps {
  onBookShoot: () => void;
  onGetPrints: () => void;
  onScrollDown: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookShoot, onGetPrints, onScrollDown }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80)`
          }}
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-[#070709]/40 to-[#070709]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/70 via-transparent to-[#070709]/70" />
      </motion.div>

      {/* Floating golden particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-gold-400" />
          <span className="text-xs font-medium tracking-[0.2em] text-gold-300 uppercase">
            Award-Winning Cinematic Photography & Premium Print Lab
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-cinematic font-bold leading-tight mb-6"
        >
          <span className="block text-4xl sm:text-5xl md:text-7xl text-white">
            Crafting Timeless
          </span>
          <span className="block text-4xl sm:text-5xl md:text-7xl text-gold-gradient mt-2">
            Visual Legacies
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-xl text-gray-300/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Where cinematic photography meets the art of fine print. From destination weddings
          to gallery-grade canvas prints — every frame, perfected.
        </motion.p>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookShoot}
            className="group flex items-center gap-3 px-8 py-4 bg-gold-gradient rounded-2xl text-black font-semibold text-base shadow-lg shadow-gold-500/20 transition-all"
          >
            <Camera size={20} />
            Book a Shoot
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: 'rgba(212, 175, 55, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetPrints}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl text-gold-400 border-2 border-gold-500/30 bg-gold-500/5 backdrop-blur-sm font-semibold text-base hover:bg-gold-500/10 transition-all"
          >
            <Printer size={20} />
            Get Prints Made
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16"
        >
          {[
            { value: '500+', label: 'Events Captured' },
            { value: '12K+', label: 'Prints Delivered' },
            { value: '50+', label: 'Canvas Exhibitions' },
            { value: '100%', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gold-gradient font-cinematic">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={onScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
