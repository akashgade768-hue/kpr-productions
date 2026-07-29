import { PortfolioItem, PrintServiceItem, Testimonial, ClientProfile, WorkerStaff, EventProject, Album, AlbumImage, LeadInquiry, AuditLog } from '../types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'The Royal Heritage Wedding — Udaipur',
    category: 'Weddings',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'p2',
    title: 'Minimalist Editorial Portraiture',
    category: 'Portraits',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'p3',
    title: 'Sunset Coast Pre-wedding Stories',
    category: 'Pre-wedding',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'p4',
    title: 'Global Tech Summit Gala & Concert',
    category: 'Events',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'p5',
    title: 'Luxury Architectural Campaign',
    category: 'Commercial',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'p6',
    title: 'Vogue Style Fashion Showcase',
    category: 'Portraits',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    featured: false
  }
];

export const INITIAL_PRINT_SERVICES: PrintServiceItem[] = [
  {
    id: 'pr1',
    title: 'Fine Art Metallic & Luster Prints',
    description: 'Museum-grade archival prints crafted with 12-color Pigment Ink on 310gsm Hahnemühle paper for lifelong color accuracy.',
    category: 'Photo Prints',
    image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    starting_price: '₹450',
    features: ['12-Color Pigment Precision', 'Archival Lifespan (100+ Yrs)', 'Deep Contrast Black Density', 'Custom Sizing up to 44" Width']
  },
  {
    id: 'pr2',
    title: 'Hand-Crafted Gallery Canvas Wraps',
    description: 'Heavyweight cotton-poly canvas stretched on kiln-dried teak wood frames with protective UV matte coating.',
    category: 'Canvas Prints',
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    starting_price: '₹1,800',
    features: ['1.5-inch Solid Wood Frame', 'Anti-Fade UV Laminate', 'Seamless Mirrored Edges', 'Pre-Installed Hanging Hardware']
  },
  {
    id: 'pr3',
    title: 'Bespoke Flush Mount Leather Photo Books',
    description: 'High-end flush mount layflat albums featuring silver-halide photo pages and genuine Italian leather binding.',
    category: 'Photo Books',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    starting_price: '₹8,500',
    features: ['Seamless 180° Layflat Spread', 'Heavy Cardstock Pages', 'Custom Foil Stamping Cover', 'Luxury Velvet Presentation Box']
  },
  {
    id: 'pr4',
    title: 'Vintage Photo Restoration & Digital Retouching',
    description: 'Expert manual restoration of torn, faded, or damaged antique photographs using AI and master artist retouching.',
    category: 'Restoration',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    starting_price: '₹950',
    features: ['Scratch & Tear Repairs', 'Colorization of Black & White', 'Resolution Upscaling', 'High-Res Digital File Included']
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Ananya & Vikram Sharma',
    event_type: 'Udaipur Destination Wedding',
    quote: 'KPR Production captured the magic of our 3-day wedding with breathtaking artistry. The flipbook album they delivered exceeded every expectation!',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't2',
    client_name: 'Rohan Mehta',
    event_type: 'Luxury Brand Campaign',
    quote: 'The print lab quality at KPR is unmatched. The metallic finish canvas prints transformed our commercial showroom completely.',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'c1',
    name: 'Priya & Rahul Kapoor',
    email: 'client@kprproduction.com',
    phone: '+91 98765 43210',
    created_at: '2026-06-15',
    eventsCount: 2,
    driveAccess: true
  },
  {
    id: 'c2',
    name: 'Aarav Malhotra',
    email: 'aarav@malhotra.com',
    phone: '+91 98123 45678',
    created_at: '2026-07-01',
    eventsCount: 1,
    driveAccess: true
  }
];

export const INITIAL_WORKERS: WorkerStaff[] = [
  {
    id: 'w1',
    name: 'Alex Vance',
    work_email: 'alex@kprproduction.com',
    mail_provider_id: 'zoho_user_88219',
    role: 'staff',
    created_by: 'Super Admin',
    created_at: '2026-05-10',
    status: 'active'
  },
  {
    id: 'w2',
    name: 'Elena Rostova',
    work_email: 'elena@kprproduction.com',
    mail_provider_id: 'zoho_user_99104',
    role: 'admin',
    created_by: 'Super Admin',
    created_at: '2026-06-01',
    status: 'active'
  }
];

export const INITIAL_EVENTS: EventProject[] = [
  {
    id: 'ev1',
    client_id: 'c1',
    client_name: 'Priya & Rahul Kapoor',
    title: 'Kapoor Grand Royal Wedding',
    date: '2026-05-20',
    drive_link: 'https://drive.google.com/drive/folders/1_KPR_SAMPLE_DRIVE_FOLDER_KAPOOR_WEDDING',
    status: 'Album Ready',
    category: 'Wedding'
  },
  {
    id: 'ev2',
    client_id: 'c1',
    client_name: 'Priya & Rahul Kapoor',
    title: 'Goa Sunset Pre-wedding Session',
    date: '2026-04-12',
    drive_link: 'https://drive.google.com/drive/folders/1_KPR_SAMPLE_DRIVE_FOLDER_GOA_PREWEDDING',
    status: 'Completed',
    category: 'Pre-wedding'
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb1',
    client_id: 'c1',
    event_id: 'ev1',
    event_title: 'Kapoor Grand Royal Wedding',
    title: 'Royal Wedding Collector Edition',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    published: true,
    created_at: '2026-05-28',
    page_count: 8
  }
];

export const INITIAL_ALBUM_IMAGES: AlbumImage[] = [
  {
    id: 'img1',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    title: 'Main Ceremonial Mandap Entry',
    page_order: 1,
    is_selected: true,
    comment: 'Must print on 24x36 Canvas!'
  },
  {
    id: 'img2',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    title: 'Twilight Sunset Couple Portrait',
    page_order: 2,
    is_selected: true
  },
  {
    id: 'img3',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    title: 'Bridal Jewelry Detail Shot',
    page_order: 3
  },
  {
    id: 'img4',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    title: 'Garland Exchange Moments',
    page_order: 4,
    is_selected: true
  },
  {
    id: 'img5',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    title: 'Sangeet Choreography Celebration',
    page_order: 5
  },
  {
    id: 'img6',
    album_id: 'alb1',
    image_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    title: 'Family Blessing Ritual',
    page_order: 6
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: 'ld1',
    name: 'Siddharth Varma',
    email: 'siddharth@varma.com',
    phone: '+91 99887 76655',
    type: 'Photography',
    service_category: 'Destination Wedding',
    event_date: '2026-11-15',
    budget_range: '₹3,000,000 - ₹5,000,000',
    message: 'Looking for full 4-day wedding coverage in Jaipur including Drone and Color Print Lab photo books.',
    status: 'New',
    created_at: '2026-07-29 14:30'
  },
  {
    id: 'ld2',
    name: 'Kavita Roy',
    email: 'kavita@designstudio.in',
    phone: '+91 91234 56789',
    type: 'Color Print Lab',
    service_category: 'Gallery Canvas Wraps',
    message: 'Require 25 large-format stretched canvas prints for an upcoming art gallery exhibition.',
    status: 'In Progress',
    created_at: '2026-07-28 11:15'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud1',
    user_name: 'System Admin',
    user_email: 'admin@kprproduction.com',
    role: 'superadmin',
    action: 'Client Account Created',
    details: 'Provisioned login for client Priya & Rahul Kapoor (c1)',
    timestamp: '2026-07-29 10:15 AM',
    ip_address: '103.45.12.90'
  },
  {
    id: 'aud2',
    user_name: 'Elena Rostova',
    user_email: 'elena@kprproduction.com',
    role: 'admin',
    action: 'Worker Provisioned',
    details: 'Created mailbox alex@kprproduction.com via Zoho Mail API',
    timestamp: '2026-07-28 04:22 PM',
    ip_address: '103.45.12.91'
  }
];
