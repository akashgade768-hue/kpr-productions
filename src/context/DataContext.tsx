import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ClientProfile, WorkerStaff, EventProject, Album, AlbumImage,
  LeadInquiry, PortfolioItem, PrintServiceItem, Testimonial, AuditLog, PhotoSelection
} from '../types';
import {
  INITIAL_PORTFOLIO, INITIAL_PRINT_SERVICES, INITIAL_TESTIMONIALS,
  INITIAL_CLIENTS, INITIAL_WORKERS, INITIAL_EVENTS,
  INITIAL_ALBUMS, INITIAL_ALBUM_IMAGES, INITIAL_LEADS, INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface DataContextType {
  // Public site content
  portfolio: PortfolioItem[];
  printServices: PrintServiceItem[];
  testimonials: Testimonial[];
  // Admin data
  clients: ClientProfile[];
  workers: WorkerStaff[];
  events: EventProject[];
  albums: Album[];
  albumImages: AlbumImage[];
  leads: LeadInquiry[];
  auditLogs: AuditLog[];
  selections: PhotoSelection[];
  // CRUD Actions
  addClient: (client: ClientProfile) => void;
  removeClient: (id: string) => void;
  addWorker: (worker: WorkerStaff) => void;
  toggleWorkerStatus: (id: string) => void;
  addEvent: (event: EventProject) => void;
  addAlbum: (album: Album) => void;
  addAlbumImage: (image: AlbumImage) => void;
  toggleAlbumPublish: (albumId: string) => void;
  addLead: (lead: LeadInquiry) => void;
  updateLeadStatus: (id: string, status: LeadInquiry['status']) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (id: string) => void;
  toggleSelection: (albumImageId: string, clientId: string) => void;
  updateSelectionComment: (albumImageId: string, comment: string) => void;
  submitSelections: (albumId: string, clientId: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getClientEvents: (clientId: string) => EventProject[];
  getClientAlbums: (clientId: string) => Album[];
  getAlbumImages: (albumId: string) => AlbumImage[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [printServices] = useState<PrintServiceItem[]>(INITIAL_PRINT_SERVICES);
  const [testimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [workers, setWorkers] = useState<WorkerStaff[]>(INITIAL_WORKERS);
  const [events, setEvents] = useState<EventProject[]>(INITIAL_EVENTS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>(INITIAL_ALBUM_IMAGES);
  const [leads, setLeads] = useState<LeadInquiry[]>(INITIAL_LEADS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [selections, setSelections] = useState<PhotoSelection[]>([]);

  const addClient = useCallback((client: ClientProfile) => {
    setClients(prev => [client, ...prev]);
  }, []);

  const removeClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  const addWorker = useCallback((worker: WorkerStaff) => {
    setWorkers(prev => [worker, ...prev]);
  }, []);

  const toggleWorkerStatus = useCallback((id: string) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === 'active' ? 'suspended' : 'active' } as WorkerStaff : w
    ));
  }, []);

  const addEvent = useCallback((event: EventProject) => {
    setEvents(prev => [event, ...prev]);
  }, []);

  const addAlbum = useCallback((album: Album) => {
    setAlbums(prev => [album, ...prev]);
  }, []);

  const addAlbumImage = useCallback((image: AlbumImage) => {
    setAlbumImages(prev => [...prev, image]);
  }, []);

  const toggleAlbumPublish = useCallback((albumId: string) => {
    setAlbums(prev => prev.map(a =>
      a.id === albumId ? { ...a, published: !a.published } : a
    ));
  }, []);

  const addLead = useCallback((lead: LeadInquiry) => {
    setLeads(prev => [lead, ...prev]);
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadInquiry['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }, []);

  const addPortfolioItem = useCallback((item: PortfolioItem) => {
    setPortfolio(prev => [item, ...prev]);
  }, []);

  const removePortfolioItem = useCallback((id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleSelection = useCallback((albumImageId: string, clientId: string) => {
    setSelections(prev => {
      const existing = prev.find(s => s.album_image_id === albumImageId && s.client_id === clientId);
      if (existing) {
        return prev.map(s =>
          s.album_image_id === albumImageId && s.client_id === clientId
            ? { ...s, favorited: !s.favorited }
            : s
        );
      }
      return [...prev, {
        id: `sel_${Date.now()}`,
        client_id: clientId,
        album_id: '',
        album_image_id: albumImageId,
        status: 'Draft' as const,
        favorited: true,
        updated_at: new Date().toISOString()
      }];
    });
  }, []);

  const updateSelectionComment = useCallback((albumImageId: string, comment: string) => {
    setSelections(prev => prev.map(s =>
      s.album_image_id === albumImageId ? { ...s, note: comment } : s
    ));
  }, []);

  const submitSelections = useCallback((albumId: string, clientId: string) => {
    setSelections(prev => prev.map(s =>
      s.client_id === clientId ? { ...s, album_id: albumId, status: 'Submitted' as const } : s
    ));
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    setAuditLogs(prev => [{
      ...log,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleString()
    }, ...prev]);
  }, []);

  const getClientEvents = useCallback((clientId: string) => {
    return events.filter(e => e.client_id === clientId);
  }, [events]);

  const getClientAlbums = useCallback((clientId: string) => {
    return albums.filter(a => a.client_id === clientId && a.published);
  }, [albums]);

  const getAlbumImages = useCallback((albumId: string) => {
    return albumImages.filter(i => i.album_id === albumId).sort((a, b) => a.page_order - b.page_order);
  }, [albumImages]);

  return (
    <DataContext.Provider value={{
      portfolio, printServices, testimonials,
      clients, workers, events, albums, albumImages, leads, auditLogs, selections,
      addClient, removeClient, addWorker, toggleWorkerStatus,
      addEvent, addAlbum, addAlbumImage, toggleAlbumPublish,
      addLead, updateLeadStatus, addPortfolioItem, removePortfolioItem,
      toggleSelection, updateSelectionComment, submitSelections,
      addAuditLog, getClientEvents, getClientAlbums, getAlbumImages
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
