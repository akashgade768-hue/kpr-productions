import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Printer, ChevronDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onBookShoot: () => void;
  onGetPrints: () => void;
  onScrollDown: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookShoot, onGetPrints, onScrollDown }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Interactive Particle Canvas (MouseMove reaction)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle attraction to mouse position
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.3;
          p.y += (dy / dist) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <section
      ref={ref}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/85 via-[#070709]/50 to-[#070709]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/80 via-transparent to-[#070709]/80" />
      </motion.div>

      {/* Interactive Light Field Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Hero Content */}
      <motion.div style={{ opacity }} className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-md shadow-lg shadow-gold-500/10"
        >
          <Sparkles size={14} className="text-gold-400" />
          <span className="text-xs font-medium tracking-[0.2em] text-gold-300 uppercase">
            21st-Century Cinematic Photography & Color Print Lab
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-cinematic font-bold leading-tight mb-6"
        >
          <span className="block text-4xl sm:text-6xl md:text-8xl text-white tracking-wide">
            Crafting Timeless
          </span>
          <span className="block text-4xl sm:text-6xl md:text-8xl text-gold-gradient mt-2">
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
          Where documentary authenticity meets museum-grade print craftsmanship.
          From destination royal weddings to 12-color archival prints — every frame, perfected.
        </motion.p>

        {/* Dual CTAs with Spring Physics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212, 175, 55, 0.45)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookShoot}
            className="group flex items-center gap-3 px-9 py-4 bg-gold-gradient rounded-2xl text-black font-semibold text-base shadow-xl shadow-gold-500/25 transition-all"
          >
            <Camera size={20} />
            Book a Shoot
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: 'rgba(212, 175, 55, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetPrints}
            className="flex items-center gap-3 px-9 py-4 rounded-2xl text-gold-400 border-2 border-gold-500/30 bg-gold-500/5 backdrop-blur-md font-semibold text-base hover:bg-gold-500/15 transition-all"
          >
            <Printer size={20} />
            Get Prints Made
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-10 mt-16"
        >
          {[
            { value: '500+', label: 'Events Captured' },
            { value: '12K+', label: 'Archival Prints' },
            { value: '50+', label: 'Exhibitions' },
            { value: '100%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gold-gradient font-cinematic">
                {stat.value}
              </div>
              <div className="text-[11px] text-gray-500 mt-1 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Down Button */}
      <motion.button
        onClick={onScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">Scroll Down</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
