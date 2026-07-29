import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Printer, Calendar, DollarSign, Send, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'Photography' | 'Color Print Lab';
}

const PHOTO_CATEGORIES = ['Destination Wedding', 'Portrait Session', 'Event Coverage', 'Commercial Shoot', 'Pre-wedding Session'];
const PRINT_CATEGORIES = ['Fine Art Prints', 'Gallery Canvas Wraps', 'Framed Prints', 'Luxury Photo Books', 'Restoration & Retouching', 'Bulk / Commercial Printing'];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, defaultType = 'Photography' }) => {
  const { addLead } = useData();
  const [type, setType] = useState<'Photography' | 'Color Print Lab'>(defaultType);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service_category: '', event_date: '', budget_range: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = type === 'Photography' ? PHOTO_CATEGORIES : PRINT_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      id: `ld_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type,
      service_category: formData.service_category,
      event_date: formData.event_date || undefined,
      budget_range: formData.budget_range || undefined,
      message: formData.message,
      status: 'New',
      created_at: new Date().toLocaleString()
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: '', email: '', phone: '', service_category: '', event_date: '', budget_range: '', message: '' });
    }, 3000);
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-dark-border">
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
              <h2 className="text-xl font-cinematic font-bold text-white">
                {type === 'Photography' ? 'Book a Session' : 'Get a Print Quote'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details and we'll get back to you within 24 hours.</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Inquiry Submitted!</h3>
                <p className="text-sm text-gray-400">Our team will review your request and contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Type Toggle */}
                <div className="flex gap-2 p-1 rounded-xl bg-dark-elevated border border-dark-border">
                  {(['Photography', 'Color Print Lab'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setType(t); update('service_category', ''); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        type === t ? 'bg-gold-gradient text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t === 'Photography' ? <Camera size={16} /> : <Printer size={16} />}
                      {t}
                    </button>
                  ))}
                </div>

                {/* Name, Email, Phone */}
                {[
                  { field: 'name', icon: <User size={16} />, type: 'text', placeholder: 'Your full name', required: true },
                  { field: 'email', icon: <Mail size={16} />, type: 'email', placeholder: 'your@email.com', required: true },
                  { field: 'phone', icon: <Phone size={16} />, type: 'tel', placeholder: '+91 98765 43210', required: false },
                ].map(({ field, icon, type: inputType, placeholder, required }) => (
                  <div key={field} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
                    <input
                      type={inputType}
                      value={(formData as any)[field]}
                      onChange={(e) => update(field, e.target.value)}
                      required={required}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
                    />
                  </div>
                ))}

                {/* Service Category */}
                <select
                  value={formData.service_category}
                  onChange={(e) => update('service_category', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white focus:border-gold-500/50 focus:outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a service...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Date + Budget */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Calendar size={16} /></div>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => update('event_date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white focus:border-gold-500/50 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><DollarSign size={16} /></div>
                    <input
                      type="text"
                      value={formData.budget_range}
                      onChange={(e) => update('budget_range', e.target.value)}
                      placeholder="Budget range"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-500"><MessageSquare size={16} /></div>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => update('message', e.target.value)}
                    required
                    placeholder="Tell us about your project..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm"
                >
                  <Send size={16} />
                  Submit Inquiry
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
