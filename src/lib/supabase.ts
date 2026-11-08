'use client';

// Supabase mock client that emulates database persistence in localStorage
// This allows the full platform to run client-side without API keys.

export interface Project {
  id: string;
  name_en: string;
  name_ta: string;
  description_en: string;
  description_ta: string;
  location_name_en: string;
  location_name_ta: string;
  google_maps_url: string;
  project_type: 'plot_layout' | 'villa_community' | 'farm_land';
  status: 'active' | 'completed' | 'upcoming';
  drone_video_url?: string;
  virtual_tour_url?: string;
  brochure_url?: string;
  banner_image_url?: string;
  nearby_amenities?: { name: string; dist: string }[];
}

export interface Property {
  id: string;
  project_id: string;
  property_number: string;
  area_sqft: number;
  price: number;
  status: 'available' | 'booked' | 'sold' | 'blocked';
  property_type: 'plot' | 'villa' | 'farmland';
  facing: string;
  amenities: string[];
}

export interface Lead {
  id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  preferred_project_type?: 'plot' | 'villa' | 'farmland' | 'any';
  lead_source: string;
  lead_stage: 'new' | 'interested' | 'follow_up' | 'site_visit_scheduled' | 'negotiation' | 'booked' | 'registered' | 'completed' | 'lost';
  ai_score: 'hot' | 'warm' | 'cold';
  ai_score_reason?: string;
  assigned_agent_id?: string;
  notes?: string;
  preferred_language: 'en' | 'ta';
  created_at: string;
}

export interface LeadHistory {
  id: string;
  lead_id: string;
  agent_id?: string;
  interaction_type: 'call' | 'whatsapp_sent' | 'whatsapp_received' | 'email' | 'site_visit_note' | 'negotiation_note' | 'general';
  summary_en: string;
  summary_ta?: string;
  next_follow_up_date?: string;
  created_at: string;
}

export interface SiteVisit {
  id: string;
  lead_id: string;
  project_id: string;
  agent_id?: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  cab_required: boolean;
  pickup_location?: string;
  feedback_en?: string;
  feedback_ta?: string;
}

export interface Booking {
  id: string;
  lead_id: string;
  property_id: string;
  agent_id?: string;
  agreed_price: number;
  advance_amount_paid: number;
  payment_status: 'pending' | 'partially_paid' | 'fully_paid';
  booking_date: string;
  registration_status: 'pending' | 'scheduled' | 'completed';
  registration_date?: string;
  notes?: string;
}

export interface LandAcquisition {
  id: string;
  seller_name: string;
  seller_phone?: string;
  location_name: string;
  survey_numbers: string;
  total_area_acres: number;
  asking_price: number;
  agreed_price?: number;
  advance_paid: number;
  status: 'under_verification' | 'legal_clear' | 'legal_rejected' | 'acquired' | 'layout_approved' | 'dropped';
  notes?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'sales_executive';
  status: 'active' | 'inactive';
}

// Default Seed Data
const defaultProjects: Project[] = [];
const defaultProperties: Property[] = [];
const defaultAgents: Agent[] = [];
const defaultLeads: Lead[] = [];
const defaultLeadHistory: LeadHistory[] = [];
const defaultSiteVisits: SiteVisit[] = [];
const defaultBookings: Booking[] = [];
const defaultLandAcquisitions: LandAcquisition[] = [];

// LocalStorage Helpers
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Initialize DB in LocalStorage
export const initializeDB = (force = false) => {
  if (typeof window === 'undefined') return;
  const dbVersion = 'v2_empty';
  const currentVersion = localStorage.getItem('svv_db_version');
  if (force || currentVersion !== dbVersion) {
    setStorageItem('svv_projects', defaultProjects);
    setStorageItem('svv_properties', defaultProperties);
    setStorageItem('svv_agents', defaultAgents);
    setStorageItem('svv_leads', defaultLeads);
    setStorageItem('svv_lead_history', defaultLeadHistory);
    setStorageItem('svv_site_visits', defaultSiteVisits);
    setStorageItem('svv_bookings', defaultBookings);
    setStorageItem('svv_land_acquisitions', defaultLandAcquisitions);
    localStorage.setItem('svv_db_version', dbVersion);
  }
};

// DB Client API wrapper
export const db = {
  // Projects
  getProjects: (): Project[] => {
    initializeDB();
    return getStorageItem('svv_projects', defaultProjects);
  },
  getProjectById: (id: string): Project | undefined => {
    return db.getProjects().find(p => p.id === id);
  },

  // Properties
  getProperties: (): Property[] => {
    initializeDB();
    return getStorageItem('svv_properties', defaultProperties);
  },
  getPropertiesByProject: (projectId: string): Property[] => {
    return db.getProperties().filter(p => p.project_id === projectId);
  },
  getPropertyById: (id: string): Property | undefined => {
    return db.getProperties().find(p => p.id === id);
  },
  updatePropertyStatus: (propertyId: string, status: Property['status']): Property[] => {
    const properties = db.getProperties();
    const updated = properties.map(p => p.id === propertyId ? { ...p, status } : p);
    setStorageItem('svv_properties', updated);
    return updated;
  },

  // Agents
  getAgents: (): Agent[] => {
    initializeDB();
    return getStorageItem('svv_agents', defaultAgents);
  },

  // Leads
  getLeads: (): Lead[] => {
    initializeDB();
    return getStorageItem('svv_leads', defaultLeads);
  },
  getLeadById: (id: string): Lead | undefined => {
    return db.getLeads().find(l => l.id === id);
  },
  createLead: (lead: Omit<Lead, 'id' | 'created_at' | 'lead_stage' | 'ai_score' | 'assigned_agent_id'>): Lead => {
    const leads = db.getLeads();
    const agents = db.getAgents().filter(a => a.role === 'sales_executive' && a.status === 'active');
    
    // Simple Round-Robin/Random assignment
    const assignedAgent = agents.length > 0 ? agents[Math.floor(Math.random() * agents.length)] : undefined;
    
    // Emulated AI Lead Scoring logic based on budget/details
    let ai_score: Lead['ai_score'] = 'warm';
    let ai_score_reason = 'Lead captured with standard parameters.';
    
    const budgetMax = lead.budget_max || 0;
    if (budgetMax > 6000000 || lead.preferred_project_type === 'villa') {
      ai_score = 'hot';
      ai_score_reason = 'High budget client interested in villa communities.';
    } else if (lead.phone && lead.first_name.length > 2) {
      ai_score = 'warm';
      ai_score_reason = 'Valid contact parameters, standard plot search.';
    } else {
      ai_score = 'cold';
      ai_score_reason = 'Vague details, minimal budget parameters.';
    }

    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      lead_stage: 'new',
      ai_score,
      ai_score_reason,
      assigned_agent_id: assignedAgent?.id,
      created_at: new Date().toISOString()
    };

    leads.unshift(newLead);
    setStorageItem('svv_leads', leads);

    // Create history entry
    db.createHistoryEntry({
      lead_id: newLead.id,
      agent_id: assignedAgent?.id,
      interaction_type: 'whatsapp_sent',
      summary_en: `n8n Trigger: Automatic Welcome Message sent via WhatsApp to ${newLead.phone}. Assigned Agent: ${assignedAgent?.name || 'Sales Team'}.`,
      summary_ta: `n8n தானியங்கி தூண்டுதல்: ${newLead.phone} என்ற எண்ணிற்கு வாட்ஸ்அப்பில் தானியங்கி வரவேற்பு செய்தி அனுப்பப்பட்டது. ஒதுக்கப்பட்ட நிர்வாகி: ${assignedAgent?.name || 'விற்பனை குழு'}.`
    });

    return newLead;
  },
  updateLeadStage: (leadId: string, lead_stage: Lead['lead_stage']): Lead[] => {
    const leads = db.getLeads();
    const updated = leads.map(l => l.id === leadId ? { ...l, lead_stage, updated_at: new Date().toISOString() } : l);
    setStorageItem('svv_leads', updated);
    return updated;
  },
  updateLeadDetails: (leadId: string, updates: Partial<Lead>): Lead[] => {
    const leads = db.getLeads();
    const updated = leads.map(l => l.id === leadId ? { ...l, ...updates, updated_at: new Date().toISOString() } : l);
    setStorageItem('svv_leads', updated);
    return updated;
  },

  // History Log
  getHistoryByLead: (leadId: string): LeadHistory[] => {
    initializeDB();
    const history = getStorageItem('svv_lead_history', defaultLeadHistory);
    return history.filter(h => h.lead_id === leadId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  createHistoryEntry: (historyEntry: Omit<LeadHistory, 'id' | 'created_at'>): LeadHistory => {
    const history = getStorageItem('svv_lead_history', defaultLeadHistory);
    const newEntry: LeadHistory = {
      ...historyEntry,
      id: `hist-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    history.push(newEntry);
    setStorageItem('svv_lead_history', history);
    return newEntry;
  },

  // Site Visits
  getSiteVisits: (): SiteVisit[] => {
    initializeDB();
    return getStorageItem('svv_site_visits', defaultSiteVisits);
  },
  createSiteVisit: (visit: Omit<SiteVisit, 'id' | 'status'>): SiteVisit => {
    const visits = db.getSiteVisits();
    const newVisit: SiteVisit = {
      ...visit,
      id: `visit-${Date.now()}`,
      status: 'scheduled'
    };
    visits.unshift(newVisit);
    setStorageItem('svv_site_visits', visits);

    // Update Lead stage
    db.updateLeadStage(visit.lead_id, 'site_visit_scheduled');

    // Create history entry
    const project = db.getProjectById(visit.project_id);
    db.createHistoryEntry({
      lead_id: visit.lead_id,
      agent_id: visit.agent_id,
      interaction_type: 'general',
      summary_en: `Site visit scheduled for ${new Date(visit.scheduled_date).toLocaleDateString()} at ${project?.name_en || 'Project'}. Cab Pickup: ${visit.cab_required ? 'Yes (' + visit.pickup_location + ')' : 'No'}.`,
      summary_ta: `${new Date(visit.scheduled_date).toLocaleDateString()} தேதியில் ${project?.name_ta || 'ப்ராஜெக்ட்'} தளத்தைப் பார்வையிட முன்பதிவு செய்யப்பட்டுள்ளது. வாகன வசதி: ${visit.cab_required ? 'உண்டு (' + visit.pickup_location + ')' : 'இல்லை'}.`
    });

    return newVisit;
  },
  updateSiteVisitStatus: (visitId: string, status: SiteVisit['status']): SiteVisit[] => {
    const visits = db.getSiteVisits();
    const updated = visits.map(v => v.id === visitId ? { ...v, status } : v);
    setStorageItem('svv_site_visits', updated);
    return updated;
  },

  // Bookings
  getBookings: (): Booking[] => {
    initializeDB();
    return getStorageItem('svv_bookings', defaultBookings);
  },
  createBooking: (booking: Omit<Booking, 'id' | 'booking_date' | 'registration_status'>): Booking => {
    const bookings = db.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      booking_date: new Date().toISOString().split('T')[0],
      registration_status: 'pending'
    };
    bookings.unshift(newBooking);
    setStorageItem('svv_bookings', bookings);

    // Mark property booked
    db.updatePropertyStatus(booking.property_id, 'booked');

    // Move lead stage to booked
    db.updateLeadStage(booking.lead_id, 'booked');

    // Create history entry
    const property = db.getPropertyById(booking.property_id);
    db.createHistoryEntry({
      lead_id: booking.lead_id,
      agent_id: booking.agent_id,
      interaction_type: 'negotiation_note',
      summary_en: `Property Booked: ${property?.property_number}. Agreed Price: Rs.${booking.agreed_price.toLocaleString()}. Advance Paid: Rs.${booking.advance_amount_paid.toLocaleString()}`,
      summary_ta: `சொத்து முன்பதிவு செய்யப்பட்டது: ${property?.property_number}. ஒப்புக்கொள்ளப்பட்ட விலை: ரூ.${booking.agreed_price.toLocaleString()}. முன்பணம்: ரூ.${booking.advance_amount_paid.toLocaleString()}`
    });

    return newBooking;
  },
  updateBookingRegStatus: (bookingId: string, registration_status: Booking['registration_status'], registration_date?: string): Booking[] => {
    const bookings = db.getBookings();
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const nextBooking = { ...b, registration_status, registration_date };
        if (registration_status === 'completed') {
          // Update property to sold
          db.updatePropertyStatus(b.property_id, 'sold');
          // Update lead stage to registered
          db.updateLeadStage(b.lead_id, 'registered');
        }
        return nextBooking;
      }
      return b;
    });
    setStorageItem('svv_bookings', updated);
    return updated;
  },

  // Land Acquisitions
  getLandAcquisitions: (): LandAcquisition[] => {
    initializeDB();
    return getStorageItem('svv_land_acquisitions', defaultLandAcquisitions);
  },
  createLandAcquisition: (land: Omit<LandAcquisition, 'id' | 'created_at' | 'status'>): LandAcquisition => {
    const lands = db.getLandAcquisitions();
    const newLand: LandAcquisition = {
      ...land,
      id: `land-${Date.now()}`,
      status: 'under_verification',
      created_at: new Date().toISOString()
    };
    lands.unshift(newLand);
    setStorageItem('svv_land_acquisitions', lands);
    return newLand;
  },
  updateLandStatus: (landId: string, status: LandAcquisition['status'], agreed_price?: number): LandAcquisition[] => {
    const lands = db.getLandAcquisitions();
    const updated = lands.map(l => l.id === landId ? { ...l, status, agreed_price: agreed_price || l.agreed_price } : l);
    setStorageItem('svv_land_acquisitions', updated);
    return updated;
  }
};
