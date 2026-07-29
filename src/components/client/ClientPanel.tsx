import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, BookOpen, Heart, User, LogOut,
  Bell, ChevronRight, Calendar, ExternalLink, Download, Eye,
  MessageSquare, CheckCircle, Send, ChevronLeft, X, ZoomIn, Maximize2,
  Clock, Star, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../ui/Toast';

type ClientView = 'dashboard' | 'drive' | 'albums' | 'selections' | 'profile';

interface ClientPanelProps {
  onLogout: () => void;
}

const ClientPanel: React.FC<ClientPanelProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const data = useData();
  const [activeView, setActiveView] = useState<ClientView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const clientId = user?.role === 'client' ? 'c1' : 'c1';
  const clientEvents = data.getClientEvents(clientId);
  const clientAlbums = data.getClientAlbums(clientId);

  const MENU = [
    { id: 'dashboard' as ClientView, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'drive' as ClientView, icon: <FolderOpen size={20} />, label: 'Drive Access' },
    { id: 'albums' as ClientView, icon: <BookOpen size={20} />, label: 'Albums' },
    { id: 'selections' as ClientView, icon: <Heart size={20} />, label: 'Selections' },
    { id: 'profile' as ClientView, icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 glass-panel border-r border-dark-border flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-dark-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
            <span className="text-black font-cinematic font-bold">K</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-cinematic font-bold text-sm text-gold-gradient tracking-wider">KPR</div>
              <div className="text-[10px] text-gray-500">Client Portal</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {MENU.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setSelectedAlbumId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-dark-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                alt="Avatar"
                className="w-9 h-9 rounded-lg object-cover border border-gold-500/30"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Client'}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <ClientDashboardView
              key="dashboard"
              clientEvents={clientEvents}
              clientAlbums={clientAlbums}
              userName={user?.name || 'Client'}
              onViewAlbum={(id) => { setSelectedAlbumId(id); setActiveView('albums'); }}
            />
          )}
          {activeView === 'drive' && (
            <DriveView key="drive" clientEvents={clientEvents} />
          )}
          {activeView === 'albums' && (
            <AlbumsView
              key="albums"
              albums={clientAlbums}
              selectedAlbumId={selectedAlbumId}
              onSelectAlbum={setSelectedAlbumId}
              clientId={clientId}
            />
          )}
          {activeView === 'selections' && (
            <SelectionsView key="selections" clientId={clientId} />
          )}
          {activeView === 'profile' && (
            <ProfileView key="profile" user={user} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ── Dashboard View ──
const ClientDashboardView: React.FC<{
  clientEvents: any[];
  clientAlbums: any[];
  userName: string;
  onViewAlbum: (id: string) => void;
}> = ({ clientEvents, clientAlbums, userName, onViewAlbum }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
    {/* Welcome */}
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-cinematic font-bold text-white mb-2">
        Welcome, <span className="text-gold-gradient">{userName.split(' ')[0]}</span>
      </h1>
      <p className="text-gray-400">Here's an overview of your events and content.</p>
    </div>

    {/* Notification */}
    <div className="glass-card-gold rounded-xl p-4 flex items-center gap-3 mb-8">
      <Bell size={20} className="text-gold-400 flex-shrink-0" />
      <p className="text-sm text-gold-200">
        <strong>New album ready!</strong> Your "Royal Wedding Collector Edition" album has been published. View it now →
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Events', value: clientEvents.length, icon: <Calendar size={18} /> },
        { label: 'Albums Ready', value: clientAlbums.length, icon: <BookOpen size={18} /> },
        { label: 'Selections', value: '3', icon: <Heart size={18} /> },
        { label: 'Drive Folders', value: clientEvents.filter(e => e.drive_link).length, icon: <FolderOpen size={18} /> },
      ].map(stat => (
        <div key={stat.label} className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 text-gold-400 mb-2">{stat.icon}</div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Events Timeline */}
    <h3 className="text-lg font-semibold text-white mb-4">Your Events</h3>
    <div className="space-y-3">
      {clientEvents.map(event => (
        <div key={event.id} className="glass-panel rounded-xl p-4 flex items-center justify-between hover:border-gold-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${
              event.status === 'Completed' ? 'bg-green-400' :
              event.status === 'Album Ready' ? 'bg-gold-400' :
              event.status === 'In Editing' ? 'bg-blue-400' : 'bg-gray-400'
            }`} />
            <div>
              <p className="text-sm font-medium text-white">{event.title}</p>
              <p className="text-xs text-gray-500">{event.date} • {event.category}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
            event.status === 'Album Ready' ? 'bg-gold-500/10 text-gold-400' :
            'bg-blue-500/10 text-blue-400'
          }`}>{event.status}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Drive Access View ──
const DriveView: React.FC<{ clientEvents: any[] }> = ({ clientEvents }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
    <h2 className="text-2xl font-cinematic font-bold text-white mb-2">Google Drive Access</h2>
    <p className="text-gray-400 text-sm mb-8">Access your event photos and videos directly in Google Drive.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clientEvents.filter(e => e.drive_link).map(event => (
        <div key={event.id} className="glass-panel rounded-2xl p-6 hover:border-gold-500/20 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FolderOpen size={24} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-500">{event.date}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">{event.title}</h3>
          <p className="text-xs text-gray-500 mb-4">{event.category}</p>
          <div className="flex gap-3">
            <a
              href={event.drive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gold-gradient rounded-xl text-black text-sm font-medium hover:shadow-lg hover:shadow-gold-500/20 transition-all"
            >
              <ExternalLink size={14} /> Open Drive
            </a>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-border text-gray-400 text-sm hover:text-white hover:border-gold-500/30 transition-all">
              <Download size={14} /> Download All
            </button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Albums / Flipbook View ──
const AlbumsView: React.FC<{
  albums: any[];
  selectedAlbumId: string | null;
  onSelectAlbum: (id: string | null) => void;
  clientId: string;
}> = ({ albums, selectedAlbumId, onSelectAlbum, clientId }) => {
  const data = useData();
  const { showToast } = useToast();
  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);
  const albumImages = selectedAlbumId ? data.getAlbumImages(selectedAlbumId) : [];
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipTo = (page: number) => {
    if (isFlipping || page < 0 || page >= albumImages.length) return;
    setIsFlipping(true);
    setCurrentPage(page);
    setTimeout(() => setIsFlipping(false), 600);
  };

  if (selectedAlbum) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
        <button onClick={() => { onSelectAlbum(null); setCurrentPage(0); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold-400 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Albums
        </button>
        <h2 className="text-2xl font-cinematic font-bold text-white mb-1">{selectedAlbum.title}</h2>
        <p className="text-sm text-gray-500 mb-8">{selectedAlbum.event_title} • {albumImages.length} pages</p>

        {/* Realistic Flipbook */}
        <div className="flipbook-container flex flex-col items-center">
          <div className="relative w-full max-w-2xl aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: -90, opacity: 0.5 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0.5 }}
                transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {albumImages[currentPage] ? (
                  <img
                    src={albumImages[currentPage].image_url}
                    alt={albumImages[currentPage].title || `Page ${currentPage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-card flex items-center justify-center text-gray-500">No Image</div>
                )}
                {/* Page spine shadow */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                {/* Page number */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white">
                  {currentPage + 1} / {albumImages.length}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {currentPage > 0 && (
              <button
                onClick={() => flipTo(currentPage - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold-500/30 transition-all z-10"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {currentPage < albumImages.length - 1 && (
              <button
                onClick={() => flipTo(currentPage + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold-500/30 transition-all z-10"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 max-w-2xl">
            {albumImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => flipTo(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentPage ? 'border-gold-500 shadow-lg shadow-gold-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Selection Actions */}
          <div className="flex gap-3 mt-6">
            {albumImages[currentPage] && (
              <>
                <button
                  onClick={() => {
                    data.toggleSelection(albumImages[currentPage].id, clientId);
                    const isFav = !data.selections.find(s => s.album_image_id === albumImages[currentPage].id && s.favorited);
                    showToast(isFav ? 'Added to Selections ❤️' : 'Removed from Selections', isFav ? 'Photo saved to your print selection list' : 'Updated selection', isFav ? 'success' : 'info');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    data.selections.find(s => s.album_image_id === albumImages[currentPage].id && s.favorited)
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'border border-dark-border text-gray-400 hover:text-red-400 hover:border-red-500/30'
                  }`}
                >
                  <Heart size={16} fill={data.selections.find(s => s.album_image_id === albumImages[currentPage].id && s.favorited) ? 'currentColor' : 'none'} />
                  Favorite
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-border text-gray-400 hover:text-white text-sm transition-all">
                  <Download size={16} /> Download
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <h2 className="text-2xl font-cinematic font-bold text-white mb-2">Your Albums</h2>
      <p className="text-gray-400 text-sm mb-8">Browse curated albums from your events.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map(album => (
          <motion.button
            key={album.id}
            whileHover={{ y: -4 }}
            onClick={() => onSelectAlbum(album.id)}
            className="glass-panel rounded-2xl overflow-hidden text-left hover:border-gold-500/30 transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white">
                <BookOpen size={12} /> {album.page_count} pages
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">{album.title}</h3>
              <p className="text-xs text-gray-500">{album.event_title}</p>
              <p className="text-xs text-gray-600 mt-1">{album.created_at}</p>
            </div>
          </motion.button>
        ))}
        {albums.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p>No albums published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Selections View ──
const SelectionsView: React.FC<{ clientId: string }> = ({ clientId }) => {
  const { selections, albumImages, submitSelections } = useData();
  const { showToast } = useToast();
  const clientSelections = selections.filter(s => s.client_id === clientId && s.favorited);
  const selectedImages = albumImages.filter(img => clientSelections.some(s => s.album_image_id === img.id));
  const allSubmitted = clientSelections.every(s => s.status === 'Submitted');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-cinematic font-bold text-white mb-1">Your Selections</h2>
          <p className="text-gray-400 text-sm">{selectedImages.length} photos selected for prints/highlights</p>
        </div>
        {selectedImages.length > 0 && !allSubmitted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              submitSelections('alb1', clientId);
              showToast('Selections Submitted! ✨', 'Studio team notified of your selected photos', 'success');
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-gradient rounded-xl text-black text-sm font-semibold"
          >
            <Send size={16} /> Submit to Studio
          </motion.button>
        )}
        {allSubmitted && selectedImages.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            <CheckCircle size={16} /> Submitted
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedImages.map(img => (
          <div key={img.id} className="relative rounded-xl overflow-hidden group">
            <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button className="p-2 rounded-full bg-white/20 text-white"><ZoomIn size={16} /></button>
              <button className="p-2 rounded-full bg-white/20 text-white"><Download size={16} /></button>
            </div>
            <div className="absolute top-2 right-2">
              <Heart size={16} className="text-red-400 fill-red-400" />
            </div>
            {img.title && (
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white truncate">{img.title}</p>
              </div>
            )}
          </div>
        ))}
        {selectedImages.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>No selections yet. Browse your albums and favorite the photos you love!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Profile View ──
const ProfileView: React.FC<{ user: any }> = ({ user }) => {
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8 max-w-2xl">
      <h2 className="text-2xl font-cinematic font-bold text-white mb-8">Profile Settings</h2>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-dark-border">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="Avatar"
            className="w-16 h-16 rounded-xl object-cover border-2 border-gold-500/30"
          />
          <div>
            <p className="text-lg font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white focus:border-gold-500/50 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm"
          />
        </div>

        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gold-gradient rounded-xl text-black font-semibold text-sm"
        >
          {saved ? <><CheckCircle size={16} /> Saved!</> : <>Save Changes</>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClientPanel;
