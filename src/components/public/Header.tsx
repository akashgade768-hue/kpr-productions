import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Printer, LogIn, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  onLoginClick: () => void;
  currentSection: string;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'photography', label: 'Photography' },
  { id: 'printlab', label: 'Print Lab' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick, currentSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-panel shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-black font-cinematic font-bold text-lg">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-cinematic font-bold tracking-[0.15em] text-gold-gradient">
                  KPR PRODUCTION
                </span>
                <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase -mt-0.5">
                  Studio & Print Lab
                </span>
              </div>
            </motion.button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                    currentSection === link.id
                      ? 'text-gold-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {currentSection === link.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('photography')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-400 border border-gold-500/30 rounded-xl hover:border-gold-500/70 hover:bg-gold-500/10 transition-all"
              >
                <Camera size={16} />
                Book a Shoot
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('printlab')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gold-gradient rounded-xl hover:shadow-lg hover:shadow-gold-500/30 transition-all"
              >
                <Printer size={16} />
                Get Prints
              </motion.button>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 transition-colors"
              >
                <LogIn size={16} />
                Login
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gold-400 transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                  className={`text-left px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                    currentSection === link.id
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="border-t border-dark-border my-4 pt-4 flex flex-col gap-3">
                <button
                  onClick={() => { onNavigate('photography'); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-gold-400 border border-gold-500/30 rounded-xl"
                >
                  <Camera size={18} /> Book a Shoot
                </button>
                <button
                  onClick={() => { onNavigate('printlab'); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-black bg-gold-gradient rounded-xl font-medium"
                >
                  <Printer size={18} /> Get Prints Made
                </button>
                <button
                  onClick={() => { onLoginClick(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <LogIn size={18} /> Admin / Client Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
