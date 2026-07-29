import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCog, Palette, FolderOpen, BookOpen, Shield, LogOut,
  Plus, X, Mail, Phone, Send, CheckCircle, Trash2, Eye, EyeOff, RefreshCw,
  TrendingUp, Clock, Bell, ExternalLink, Edit, ToggleLeft, ToggleRight,
  FileText, Activity, Search, ChevronDown, Globe, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { provisionWorkerEmailApi } from '../../lib/supabase';

type AdminView = 'dashboard' | 'clients' | 'staff' | 'cms' | 'drives' | 'albums' | 'audit';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const isStaff = user?.role === 'staff';

  const MENU: { id: AdminView; icon: React.ReactNode; label: string; staffHidden?: boolean }[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'clients', icon: <Users size={20} />, label: 'Clients' },
    { id: 'staff', icon: <UserCog size={20} />, label: 'Staff & Email', staffHidden: true },
    { id: 'cms', icon: <Palette size={20} />, label: 'CMS / Content' },
    { id: 'drives', icon: <FolderOpen size={20} />, label: 'Drive Links' },
    { id: 'albums', icon: <BookOpen size={20} />, label: 'Albums' },
    { id: 'audit', icon: <Shield size={20} />, label: 'Audit Logs', staffHidden: true },
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-dark-border flex flex-col">
        <div className="px-4 py-5 border-b border-dark-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <span className="text-black font-cinematic font-bold">K</span>
          </div>
          <div>
            <div className="font-cinematic font-bold text-sm text-gold-gradient tracking-wider">KPR</div>
            <div className="text-[10px] text-gray-500">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {MENU.filter(m => !isStaff || !m.staffHidden).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'}
              alt="" className="w-9 h-9 rounded-lg object-cover border border-gold-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gold-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && <AdminDashboard key="dash" />}
          {activeView === 'clients' && <ClientMgmt key="clients" />}
          {activeView === 'staff' && <StaffMgmt key="staff" />}
          {activeView === 'cms' && <CMSMgmt key="cms" />}
          {activeView === 'drives' && <DriveMgmt key="drives" />}
          {activeView === 'albums' && <AlbumMgmt key="albums" />}
          {activeView === 'audit' && <AuditView key="audit" />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ── Admin Dashboard ──
const AdminDashboard: React.FC = () => {
  const { clients, leads, events, workers, auditLogs } = useData();
  const newLeads = leads.filter(l => l.status === 'New').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-cinematic font-bold text-white mb-8">
        Admin <span className="text-gold-gradient">Dashboard</span>
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients', value: clients.length, icon: <Users size={20} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Active Projects', value: events.filter(e => e.status !== 'Completed').length, icon: <Activity size={20} />, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
          { label: 'New Inquiries', value: newLeads, icon: <Bell size={20} />, color: 'text-gold-400 bg-gold-500/10 border-gold-500/20' },
          { label: 'Team Members', value: workers.length, icon: <UserCog size={20} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Bell size={16} className="text-gold-400" /> Recent Leads
          </h3>
          <div className="space-y-3">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                <div>
                  <p className="text-sm text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.type} • {lead.service_category}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  lead.status === 'New' ? 'bg-gold-500/10 text-gold-400' :
                  lead.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-green-500/10 text-green-400'
                }`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={16} className="text-gold-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-dark-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-dark-elevated flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-white">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.user_name} • {log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Client Management ──
const ClientMgmt: React.FC = () => {
  const { clients, addClient, removeClient, addAuditLog } = useData();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newClient = {
      id: `c_${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      created_at: new Date().toLocaleDateString(),
      eventsCount: 0,
      driveAccess: false
    };
    addClient(newClient);
    addAuditLog({
      user_name: user?.name || 'Admin',
      user_email: user?.email || '',
      role: user?.role || 'admin',
      action: 'Client Created',
      details: `Created client account for ${form.name} (${form.email})`,
      ip_address: '0.0.0.0'
    });
    setForm({ name: '', email: '', phone: '' });
    setShowAdd(false);
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-cinematic font-bold text-white">Client Management</h2>
          <p className="text-sm text-gray-500 mt-1">{clients.length} total clients</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient rounded-xl text-black text-sm font-semibold">
          <Plus size={16} /> Add Client
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filtered.map(client => (
          <div key={client.id} className="glass-panel rounded-xl p-4 flex items-center justify-between hover:border-gold-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm">
                {client.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{client.name}</p>
                <p className="text-xs text-gray-500">{client.email} • {client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{client.eventsCount} events</span>
              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors"><Edit size={14} /></button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gold-400 transition-colors">
                <Send size={14} />
              </button>
              <button onClick={() => removeClient(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md glass-panel rounded-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Add New Client</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Client Name" className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address" type="email" className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone Number" type="tel" className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAdd}
                  className="w-full py-3 bg-gold-gradient rounded-xl text-black font-semibold text-sm flex items-center justify-center gap-2">
                  <Plus size={16} /> Create & Send Invite
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Staff / Email Provisioning ──
const StaffMgmt: React.FC = () => {
  const { workers, addWorker, toggleWorkerStatus, addAuditLog } = useData();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', handle: '', role: 'staff' as 'admin' | 'staff' });
  const [provisioning, setProvisioning] = useState(false);
  const [provisionResult, setProvisionResult] = useState<string | null>(null);

  const handleProvision = async () => {
    if (!form.name || !form.handle) return;
    setProvisioning(true);
    setProvisionResult(null);
    const result = await provisionWorkerEmailApi(form.handle, form.name, form.role);
    if (result.success) {
      addWorker({
        id: `w_${Date.now()}`,
        name: form.name,
        work_email: result.work_email,
        mail_provider_id: result.mail_provider_id,
        role: form.role,
        created_by: user?.name || 'Admin',
        created_at: new Date().toLocaleDateString(),
        status: 'active'
      });
      addAuditLog({
        user_name: user?.name || 'Admin',
        user_email: user?.email || '',
        role: user?.role || 'admin',
        action: 'Worker Email Provisioned',
        details: `Created mailbox ${result.work_email} via Zoho API (Temp password: ${result.tempPassword})`,
        ip_address: '0.0.0.0'
      });
      setProvisionResult(`✅ ${result.message}\nTemp Password: ${result.tempPassword}`);
    }
    setProvisioning(false);
    setForm({ name: '', handle: '', role: 'staff' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-cinematic font-bold text-white">Staff & Email Provisioning</h2>
          <p className="text-sm text-gray-500 mt-1">Manage team members & @kprproduction.com mailboxes</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setShowAdd(true); setProvisionResult(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient rounded-xl text-black text-sm font-semibold">
          <Plus size={16} /> Provision Email
        </motion.button>
      </div>

      {/* Workers List */}
      <div className="space-y-3">
        {workers.map(w => (
          <div key={w.id} className="glass-panel rounded-xl p-4 flex items-center justify-between hover:border-gold-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                w.status === 'active' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>{w.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-medium text-white">{w.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Globe size={10} /> {w.work_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-dark-elevated border border-dark-border text-gray-400 capitalize">{w.role}</span>
              <button onClick={() => toggleWorkerStatus(w.id)} className={`p-2 rounded-lg transition-colors ${
                w.status === 'active' ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'
              }`}>
                {w.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provision Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md glass-panel rounded-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Provision Worker Email</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Worker Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                <div className="flex items-center gap-2">
                  <input value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} placeholder="desired.handle"
                    className="flex-1 px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                  <span className="text-sm text-gold-400 font-medium whitespace-nowrap">@kprproduction.com</span>
                </div>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'staff' }))}
                  className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white focus:border-gold-500/50 focus:outline-none text-sm appearance-none">
                  <option value="staff">Staff (Photographer/Editor)</option>
                  <option value="admin">Admin / Manager</option>
                </select>

                {provisionResult && (
                  <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm whitespace-pre-line">
                    {provisionResult}
                  </div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleProvision} disabled={provisioning}
                  className="w-full py-3 bg-gold-gradient rounded-xl text-black font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {provisioning ? <><RefreshCw size={16} className="animate-spin" /> Provisioning via Zoho...</> : <><Mail size={16} /> Create Mailbox</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── CMS Management ──
const CMSMgmt: React.FC = () => {
  const { portfolio, leads, updateLeadStatus, addPortfolioItem, removePortfolioItem } = useData();
  const [tab, setTab] = useState<'portfolio' | 'leads'>('portfolio');
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [pForm, setPForm] = useState({ title: '', category: 'Weddings' as any, image_url: '' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <h2 className="text-2xl font-cinematic font-bold text-white mb-6">Content Management</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-dark-card border border-dark-border w-fit">
        {(['portfolio', 'leads'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-gold-gradient text-black' : 'text-gray-400 hover:text-white'
            }`}>{t === 'leads' ? 'Inquiry Leads' : 'Portfolio'}</button>
        ))}
      </div>

      {tab === 'portfolio' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{portfolio.length} portfolio items</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAddPortfolio(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold-gradient rounded-xl text-black text-sm font-semibold">
              <Plus size={14} /> Add Photo
            </motion.button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map(item => (
              <div key={item.id} className="relative rounded-xl overflow-hidden group">
                <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-xs text-white text-center font-medium">{item.title}</p>
                  <span className="text-[10px] text-gold-400">{item.category}</span>
                  <button onClick={() => removePortfolioItem(item.id)} className="mt-1 p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showAddPortfolio && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPortfolio(false)}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md glass-panel rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-white mb-4">Add Portfolio Item</h3>
                  <div className="space-y-3">
                    <input value={pForm.title} onChange={e => setPForm(f => ({ ...f, title: e.target.value }))} placeholder="Photo Title" className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                    <select value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value as any }))} className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white focus:border-gold-500/50 focus:outline-none text-sm">
                      {['Weddings', 'Portraits', 'Events', 'Commercial', 'Pre-wedding'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input value={pForm.image_url} onChange={e => setPForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Image URL" className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-white placeholder-gray-600 focus:border-gold-500/50 focus:outline-none text-sm" />
                    <button onClick={() => {
                      if (pForm.title && pForm.image_url) {
                        addPortfolioItem({ id: `p_${Date.now()}`, title: pForm.title, category: pForm.category, image_url: pForm.image_url, featured: false });
                        setShowAddPortfolio(false);
                        setPForm({ title: '', category: 'Weddings', image_url: '' });
                      }
                    }} className="w-full py-3 bg-gold-gradient rounded-xl text-black font-semibold text-sm">Add to Portfolio</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {tab === 'leads' && (
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="glass-panel rounded-xl p-4 hover:border-gold-500/20 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email} • {lead.phone}</p>
                  <p className="text-xs text-gold-400 mt-1">{lead.type} → {lead.service_category}</p>
                  <p className="text-xs text-gray-400 mt-2 max-w-lg">{lead.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-gray-600">{lead.created_at}</span>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border appearance-none cursor-pointer ${
                      lead.status === 'New' ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' :
                      lead.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      lead.status === 'Converted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}
                  >
                    {['New', 'In Progress', 'Converted', 'Archived'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Drive Link Management ──
const DriveMgmt: React.FC = () => {
  const { events } = useData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <h2 className="text-2xl font-cinematic font-bold text-white mb-2">Drive Link Management</h2>
      <p className="text-sm text-gray-500 mb-8">Associate Google Drive folders with client events.</p>

      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="glass-panel rounded-xl p-4 flex items-center justify-between hover:border-gold-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FolderOpen size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{event.title}</p>
                <p className="text-xs text-gray-500">{event.client_name} • {event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {event.drive_link ? (
                <a href={event.drive_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-all">
                  <ExternalLink size={12} /> Linked
                </a>
              ) : (
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-gray-400 text-xs hover:text-gold-400 hover:border-gold-500/30">
                  <Plus size={12} /> Add Link
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Album Management ──
const AlbumMgmt: React.FC = () => {
  const { albums, toggleAlbumPublish, albumImages } = useData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-cinematic font-bold text-white">Album Management</h2>
          <p className="text-sm text-gray-500 mt-1">{albums.length} albums</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient rounded-xl text-black text-sm font-semibold">
          <Plus size={16} /> Create Album
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {albums.map(album => {
          const imgs = albumImages.filter(i => i.album_id === album.id);
          return (
            <div key={album.id} className="glass-panel rounded-2xl overflow-hidden hover:border-gold-500/20 transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{album.title}</h3>
                    <p className="text-xs text-gray-500">{album.event_title} • {imgs.length} images</p>
                  </div>
                  <button onClick={() => toggleAlbumPublish(album.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      album.published
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'
                    }`}>
                    {album.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {album.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                {/* Thumbnail strip */}
                <div className="flex gap-1.5 mt-3">
                  {imgs.slice(0, 5).map(img => (
                    <div key={img.id} className="w-12 h-9 rounded-md overflow-hidden">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {imgs.length > 5 && (
                    <div className="w-12 h-9 rounded-md bg-dark-elevated flex items-center justify-center text-[10px] text-gray-500">+{imgs.length - 5}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── Audit Logs ──
const AuditView: React.FC = () => {
  const { auditLogs } = useData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
      <h2 className="text-2xl font-cinematic font-bold text-white mb-6">Activity & Audit Logs</h2>
      <div className="space-y-2">
        {auditLogs.map(log => (
          <div key={log.id} className="glass-panel rounded-xl p-4 flex items-start gap-4 hover:border-gold-500/10 transition-all">
            <div className="w-10 h-10 rounded-lg bg-dark-elevated flex items-center justify-center flex-shrink-0">
              <Activity size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{log.action}</p>
                <span className="text-[10px] text-gray-600">{log.timestamp}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{log.details}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-gray-500">{log.user_name} ({log.user_email})</span>
                <span className="text-[10px] text-gray-600">IP: {log.ip_address}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-dark-elevated text-gray-400 capitalize">{log.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
