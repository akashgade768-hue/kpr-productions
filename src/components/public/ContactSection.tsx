import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Globe, Send, CheckCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5">
          <Mail size={14} className="text-gold-400" />
          <span className="text-xs tracking-[0.2em] text-gold-300 uppercase font-medium">Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinematic font-bold text-white mb-4">
          Contact <span className="text-gold-gradient">Us</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Ready to create something extraordinary? Reach out to us for bookings, print orders, or any questions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info + Map */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <MapPin size={20} />, label: 'Studio Address', value: '42, Creative District, Film City Road, Mumbai 400065' },
              { icon: <Phone size={20} />, label: 'Phone', value: '+91 98765 43210' },
              { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: '+91 98765 43210' },
              { icon: <Globe size={20} />, label: 'Instagram', value: '@kprproduction' },
            ].map((item) => (
              <div key={item.label} className="glass-panel rounded-xl p-4 hover:border-gold-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-dark-border h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0!2d72.87!3d19.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzEyLjAiTiA3MsKwNTInMTIuMCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KPR Production Studio Location"
            />
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 space-y-5">
            <h3 className="text-lg font-semibold text-white mb-2">Send a Message</h3>

            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  required={field !== 'phone'}
                  className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
                  placeholder={`Your ${field}`}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all text-sm resize-none"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold-gradient rounded-xl text-black font-semibold text-sm shadow-lg shadow-gold-500/20 transition-all"
            >
              {submitted ? (
                <>
                  <CheckCircle size={18} />
                  Sent Successfully!
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
