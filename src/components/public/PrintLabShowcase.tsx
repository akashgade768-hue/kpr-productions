import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Printer, Layers, Frame, BookOpen, Wand2, Package, Clock, DollarSign, ChevronRight, GripVertical } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PrintLabShowcaseProps {
  onGetQuote: () => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'Photo Prints': <Printer size={24} />,
  'Canvas Prints': <Layers size={24} />,
  'Framed Prints': <Frame size={24} />,
  'Photo Books': <BookOpen size={24} />,
  'Restoration': <Wand2 size={24} />,
  'Bulk/Commercial': <Package size={24} />,
};

// Before-After Comparison Slider
const BeforeAfterSlider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !dragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = () => { dragging.current = true; };
  const handleMouseUp = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* After (restored/retouched) - full layer behind */}
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
        alt="After restoration"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Before (old/damaged) - clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
          alt="Before restoration"
          className="absolute inset-0 w-full h-full object-cover sepia brightness-75 contrast-125"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
        />
      </div>
      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gold-500 z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center shadow-lg shadow-gold-500/40">
          <GripVertical size={16} className="text-black" />
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gold-500/80 backdrop-blur-sm text-xs text-black font-medium">
        After
      </div>
    </div>
  );
};

const PrintLabShowcase: React.FC<PrintLabShowcaseProps> = ({ onGetQuote }) => {
  const { printServices } = useData();

  return (
    <section id="printlab" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5">
          <Printer size={14} className="text-gold-400" />
          <span className="text-xs tracking-[0.2em] text-gold-300 uppercase font-medium">Color Print Lab</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinematic font-bold text-white mb-4">
          Premium <span className="text-gold-gradient">Print Lab</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Museum-grade prints, hand-crafted canvas wraps, luxury photo books, and expert restoration — 
          bringing your images to life with impeccable quality.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {printServices.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group glass-panel rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-500"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 backdrop-blur-sm flex items-center justify-center text-gold-400 border border-gold-500/30">
                  {SERVICE_ICONS[service.category] || <Printer size={24} />}
                </div>
                <span className="px-3 py-1 rounded-full bg-gold-500/20 backdrop-blur-sm text-xs text-gold-300 font-medium border border-gold-500/20">
                  From {service.starting_price}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span key={feature} className="px-3 py-1 rounded-lg bg-dark-elevated text-xs text-gray-300 border border-dark-border">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Before / After Restoration Slider */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="text-2xl font-cinematic font-bold text-center text-white mb-3">
          Restoration <span className="text-gold-gradient">Magic</span>
        </h3>
        <p className="text-center text-gray-400 text-sm mb-8 max-w-lg mx-auto">
          Drag the slider to see the transformation — our expert retouching brings damaged, faded photographs back to vivid life.
        </p>
        <div className="max-w-2xl mx-auto">
          <BeforeAfterSlider />
        </div>
      </motion.div>

      {/* Turnaround & Pricing Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {[
          {
            icon: <Clock size={24} />,
            title: 'Express',
            time: '24–48 Hours',
            desc: 'Rush delivery for urgent print orders & canvas wraps',
            price: '+30% Express Fee',
            highlight: false
          },
          {
            icon: <DollarSign size={24} />,
            title: 'Standard',
            time: '5–7 Business Days',
            desc: 'Premium quality with our standard production timeline',
            price: 'Base Pricing',
            highlight: true
          },
          {
            icon: <Package size={24} />,
            title: 'Bulk / Commercial',
            time: '10–15 Business Days',
            desc: 'Volume discounts for large format exhibitions & corporate orders',
            price: 'Custom Quote',
            highlight: false
          }
        ].map((tier) => (
          <div
            key={tier.title}
            className={`rounded-2xl p-6 text-center transition-all duration-300 ${
              tier.highlight
                ? 'glass-card-gold gold-glow'
                : 'glass-panel hover:border-gold-500/20'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              tier.highlight ? 'bg-gold-gradient text-black' : 'bg-dark-elevated text-gold-400 border border-dark-border'
            }`}>
              {tier.icon}
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">{tier.title}</h4>
            <p className="text-gold-400 text-sm font-medium mb-2">{tier.time}</p>
            <p className="text-gray-400 text-sm mb-3">{tier.desc}</p>
            <span className="text-xs text-gray-500">{tier.price}</span>
          </div>
        ))}
      </motion.div>

      {/* Get a Quote CTA */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetQuote}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gold-gradient rounded-2xl text-black font-semibold text-lg shadow-lg shadow-gold-500/20"
        >
          <Printer size={22} />
          Get a Quote
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </section>
  );
};

export default PrintLabShowcase;
