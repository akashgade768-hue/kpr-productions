import React, { useState, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/public/Header';
import Hero from './components/public/Hero';
import PhotographyShowcase from './components/public/PhotographyShowcase';
import PrintLabShowcase from './components/public/PrintLabShowcase';
import AboutSection from './components/public/AboutSection';
import ContactSection from './components/public/ContactSection';
import Footer from './components/public/Footer';
import BookingModal from './components/public/BookingModal';
import AuthModal from './components/auth/AuthModal';
import ClientPanel from './components/client/ClientPanel';
import AdminPanel from './components/admin/AdminPanel';

type AppView = 'public' | 'client' | 'admin';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingType, setBookingType] = useState<'Photography' | 'Color Print Lab'>('Photography');

  const getAppView = (): AppView => {
    if (!isAuthenticated || !user) return 'public';
    if (user.role === 'client') return 'client';
    return 'admin';
  };

  const appView = getAppView();

  const handleNavigate = useCallback((section: string) => {
    setCurrentSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleBookShoot = () => {
    setBookingType('Photography');
    setShowBooking(true);
  };

  const handleGetPrints = () => {
    setBookingType('Color Print Lab');
    setShowBooking(true);
  };

  const handleLogout = () => {
    logout();
  };

  if (appView === 'client') {
    return <ClientPanel onLogout={handleLogout} />;
  }

  if (appView === 'admin') {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-gold-500 selection:text-black">
      <Header
        onNavigate={handleNavigate}
        onLoginClick={() => setShowAuth(true)}
        currentSection={currentSection}
      />

      <main>
        <Hero
          onBookShoot={handleBookShoot}
          onGetPrints={handleGetPrints}
          onScrollDown={() => handleNavigate('photography')}
        />

        <PhotographyShowcase onBookSession={handleBookShoot} />

        <PrintLabShowcase onGetQuote={handleGetPrints} />

        <AboutSection />

        <ContactSection />
      </main>

      <Footer
        onNavigate={handleNavigate}
        onLoginClick={() => setShowAuth(true)}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        defaultType={bookingType}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
