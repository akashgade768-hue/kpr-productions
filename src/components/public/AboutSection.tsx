import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Aperture, Palette, Users, Shield } from 'lucide-react';

const VALUES = [
  { icon: <Heart size={24} />, title: 'Passion-Driven', desc: 'Every frame we capture is infused with genuine love for visual storytelling.' },
  { icon: <Aperture size={24} />, title: 'Technical Mastery', desc: 'Industry-leading gear, color-calibrated monitors, and archival-grade printing processes.' },
  { icon: <Palette size={24} />, title: 'Cinematic Artistry', desc: 'We don\'t just photograph — we direct, compose, and craft cinematic narratives.' },
  { icon: <Users size={24} />, title: 'Client-First Approach', desc: 'Private galleries, secure Drive access, and dedicated account management for every project.' },
  { icon: <Shield size={24} />, title: 'Trust & Security', desc: 'Your memories are protected with encrypted storage, NDAs, and strict privacy protocols.' },
  { icon: <Award size={24} />, title: 'Award-Winning Quality', desc: 'Recognized nationally for editorial photography and fine art print craftsmanship.' },
];

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5">
            <Award size={14} className="text-gold-400" />
            <span className="text-xs tracking-[0.2em] text-gold-300 uppercase font-medium">Our Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinematic font-bold text-white mb-6">
            About <span className="text-gold-gradient">KPR Production</span>
          </h2>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Founded with an unwavering commitment to visual excellence, <strong className="text-gold-400">KPR Production</strong> is 
            a full-service cinematic photography studio and fine art color print lab. We believe every moment 
            deserves to be immortalized with the depth, emotion, and grandeur it commands.
          </p>
          <p className="text-gray-400 leading-relaxed">
            From royal destination weddings across India's most iconic palaces to large-format gallery exhibitions, 
            our team of seasoned cinematographers and master print technicians works in unison to deliver an 
            end-to-end experience — <em className="text-gray-300">from the click of the shutter to the texture of the final print in your hands.</em>
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 hover:border-gold-500/30 transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-4 group-hover:bg-gold-gradient group-hover:text-black transition-all duration-500">
                {val.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{val.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { year: '2014', event: 'Studio Founded' },
            { year: '2017', event: 'Print Lab Launched' },
            { year: '2020', event: 'National Award' },
            { year: '2024', event: '500+ Events' },
            { year: '2026', event: 'Digital Platform Launch' },
          ].map((item, i) => (
            <div key={item.year} className="text-center relative">
              <div className="text-2xl font-cinematic font-bold text-gold-gradient">{item.year}</div>
              <div className="text-xs text-gray-500 mt-1 tracking-wider uppercase">{item.event}</div>
              {i < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-10 w-8 h-px bg-dark-border" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
