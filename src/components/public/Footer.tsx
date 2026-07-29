import React from 'react';
import { Camera, Printer, Mail, Phone, MapPin, ChevronUp, Globe, Video, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onLoginClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onLoginClick }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-dark-border bg-dark-card/50">
      {/* Golden accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-black font-cinematic font-bold text-lg">K</span>
              </div>
              <div>
                <div className="font-cinematic font-bold text-white tracking-wider text-sm">KPR PRODUCTION</div>
                <div className="text-[10px] text-gray-500 tracking-widest uppercase">Studio & Print Lab</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Cinematic photography studio & fine art color print lab.
              Crafting timeless visual legacies since 2014.
            </p>
            <div className="flex gap-3">
              {[Globe, Video, MessageCircle, Heart].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-dark-elevated border border-dark-border flex items-center justify-center text-gray-500 hover:text-gold-400 hover:border-gold-500/40 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Photography Portfolio', id: 'photography' },
                { label: 'Color Print Lab', id: 'printlab' },
                { label: 'About Us', id: 'about' },
                { label: 'Contact', id: 'contact' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-sm text-gray-500 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Services</h4>
            <ul className="space-y-2.5">
              {['Destination Weddings', 'Editorial Portraits', 'Fine Art Prints', 'Canvas Gallery Wraps', 'Photo Restoration', 'Luxury Photo Books'].map(s => (
                <li key={s} className="text-sm text-gray-500">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact & Portal Access */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Reach Us</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                42, Creative District, Film City Road, Mumbai 400065
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={14} className="text-gold-500 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={14} className="text-gold-500 flex-shrink-0" />
                hello@kprproduction.com
              </li>
            </ul>
            <div className="border-t border-dark-border pt-4">
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Portal Access</p>
              <button
                onClick={onLoginClick}
                className="text-sm text-gold-400 hover:text-gold-300 transition-colors font-medium"
              >
                Admin / Client Login →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} KPR Production. All rights reserved. Handcrafted with passion.
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gold-400 transition-colors"
          >
            Back to Top <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
