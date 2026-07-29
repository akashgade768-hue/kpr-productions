export type UserRole = 'superadmin' | 'admin' | 'staff' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  work_email?: string;
  trustedUntil?: string;
  avatar?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  eventsCount: number;
  driveAccess: boolean;
}

export interface WorkerStaff {
  id: string;
  name: string;
  work_email: string; // handle@kprproduction.com
  mail_provider_id: string;
  role: 'admin' | 'staff';
  created_by: string;
  created_at: string;
  status: 'active' | 'suspended';
}

export interface EventProject {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  date: string;
  drive_link: string;
  status: 'Upcoming' | 'In Editing' | 'Album Ready' | 'Completed';
  category: 'Wedding' | 'Portrait' | 'Event' | 'Commercial' | 'Pre-wedding';
}

export interface Album {
  id: string;
  client_id: string;
  event_id: string;
  event_title: string;
  title: string;
  cover_image: string;
  published: boolean;
  created_at: string;
  page_count: number;
}

export interface AlbumImage {
  id: string;
  album_id: string;
  image_url: string;
  title?: string;
  page_order: number;
  is_selected?: boolean;
  comment?: string;
}

export interface PhotoSelection {
  id: string;
  client_id: string;
  album_id: string;
  album_image_id: string;
  status: 'Draft' | 'Submitted';
  note?: string;
  favorited: boolean;
  updated_at: string;
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Photography' | 'Color Print Lab';
  service_category: string;
  event_date?: string;
  budget_range?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Converted' | 'Archived';
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Portraits' | 'Events' | 'Commercial' | 'Pre-wedding';
  image_url: string;
  featured: boolean;
}

export interface PrintServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'Photo Prints' | 'Canvas Prints' | 'Framed Prints' | 'Photo Books' | 'Restoration' | 'Bulk/Commercial';
  image_url: string;
  starting_price: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string;
  quote: string;
  rating: number;
  avatar_url?: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_email: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ip_address: string;
}
