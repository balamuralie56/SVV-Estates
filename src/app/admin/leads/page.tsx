'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, Lead, LeadHistory } from '@/lib/supabase';
import { useApp } from '@/components/ClientProvider';
import {
  Plus,
  Phone,
  User,
  MapPin,
  Sparkles,
  Clock,
  Coins,
  X
} from 'lucide-react';

type StageType = Lead['lead_stage'];

const STAGES: { id: StageType; label: string; color: string }[] = [
  { id: 'new', label: 'New Lead', color: 'border-t-blue-500 bg-blue-500/5' },
  { id: 'interested', label: 'Interested', color: 'border-t-teal-500 bg-teal-500/5' },
  { id: 'follow_up', label: 'Follow-up', color: 'border-t-indigo-500 bg-indigo-500/5' },
  { id: 'site_visit_scheduled', label: 'Site Visit', color: 'border-t-purple-500 bg-purple-500/5' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-t-pink-500 bg-pink-500/5' },
  { id: 'booked', label: 'Booking', color: 'border-t-amber-500 bg-amber-500/5' },
  { id: 'registered', label: 'Registration', color: 'border-t-emerald-500 bg-emerald-500/5' },
  { id: 'completed', label: 'Completed', color: 'border-t-gray-500 bg-gray-500/5' }
];

function LeadsCRMContent() {
  useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>(() => db.getLeads());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Modals & Panels
  const [isAddOpen, setIsAddOpen] = useState(() => searchParams.get('action') === 'new');
  const [selectedLeadHistory, setSelectedLeadHistory] = useState<LeadHistory[]>([]);

  // Add Lead Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budgetMax, setBudgetMax] = useState('3500000');
  const [prefLoc, setPrefLoc] = useState('Tambaram');
  const [prefType, setPrefType] = useState<'plot' | 'villa' | 'farmland' | 'any'>('plot');
  const [notes, setNotes] = useState('');

  // Log Follow-up Form State
  const [interactionType, setInteractionType] = useState<LeadHistory['interaction_type']>('call');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  // Booking details form (for converting lead to booked)
  const [bookingAgreedPrice, setBookingAgreedPrice] = useState('2880000');
  const [bookingAdvance, setBookingAdvance] = useState('100000');
  const [bookingPropertyId, setBookingPropertyId] = useState('');
  
  const properties = db.getProperties().filter(p => p.status === 'available');

  function loadLeads() {
    setLeads(db.getLeads());
  }

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedLeadHistory(db.getHistoryByLead(lead.id));
    
    // Auto populate booking details pricing based on preferences
    if (lead.preferred_project_type === 'villa') {
      setBookingAgreedPrice('9500000');
    } else if (lead.preferred_project_type === 'farmland') {
      setBookingAgreedPrice('3500000');
    } else {
      setBookingAgreedPrice('2880000');
    }
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone) return;

    db.createLead({
      first_name: firstName,
      last_name: lastName || undefined,
      phone: phone,
      email: email || undefined,
      budget_min: Number(budgetMax) * 0.8,
      budget_max: Number(budgetMax),
      preferred_location: prefLoc,
      preferred_project_type: prefType,
      lead_source: 'crm_manual',
      notes: notes || undefined,
      preferred_language: 'en',
    });

    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setIsAddOpen(false);
    loadLeads();
    router.replace('/admin/leads');
  };

  const handleLogFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !interactionNotes) return;

    db.createHistoryEntry({
      lead_id: selectedLead.id,
      agent_id: 'agent-admin',
      interaction_type: interactionType,
      summary_en: interactionNotes,
      next_follow_up_date: nextFollowUp || undefined
    });

    setInteractionNotes('');
    setNextFollowUp('');
    setSelectedLeadHistory(db.getHistoryByLead(selectedLead.id));
    
    // Also move stage to follow_up if not booked yet
    if (selectedLead.lead_stage === 'new' || selectedLead.lead_stage === 'interested') {
      updateLeadStage(selectedLead.id, 'follow_up');
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !bookingPropertyId) return;

    db.createBooking({
      lead_id: selectedLead.id,
      property_id: bookingPropertyId,
      agent_id: 'agent-admin',
      agreed_price: Number(bookingAgreedPrice),
      advance_amount_paid: Number(bookingAdvance),
      payment_status: 'partially_paid',
    });

    setBookingPropertyId('');
    loadLeads();
    // Refresh selected lead details
    const updatedLead = db.getLeadById(selectedLead.id);
    if (updatedLead) setSelectedLead(updatedLead);
    setSelectedLeadHistory(db.getHistoryByLead(selectedLead.id));
  };

  const updateLeadStage = (leadId: string, stage: StageType) => {
    const updated = db.updateLeadStage(leadId, stage);
    setLeads(updated);
    
    const lead = updated.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      db.createHistoryEntry({
        lead_id: leadId,
        interaction_type: 'general',
        summary_en: `Lead stage updated to [${stage.replace('_', ' ').toUpperCase()}] by Administrator.`,
        summary_ta: `நிர்வாகி மூலம் வாடிக்கையாளர் நிலை [${stage.replace('_', ' ').toUpperCase()}] என மாற்றப்பட்டது.`
      });
      setSelectedLeadHistory(db.getHistoryByLead(leadId));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Lead CRM Queue</h1>
          <p className="text-xs text-gray-400 font-medium">Drag, drop, and coordinate your lead conversions.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-gold-light hover:bg-gold-hover text-gray-900 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-start">
        {STAGES.map((col) => {
          const colLeads = leads.filter(l => l.lead_stage === col.id);
          return (
            <div
              key={col.id}
              className="w-72 bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/80 shrink-0 border-t-4 transition-colors"
              style={{ borderTopColor: col.id === 'registered' ? '#10B981' : col.id === 'booked' ? '#F59E0B' : '#6B7280' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{col.label}</h4>
                <span className="text-[10px] font-bold bg-gray-150 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                {colLeads.length > 0 ? (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className={`p-3.5 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30 hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] ${
                        selectedLead?.id === lead.id ? 'ring-2 ring-gold-light dark:ring-gold-dark' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {lead.first_name} {lead.last_name || ''}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          lead.ai_score === 'hot' ? 'bg-red-500/10 text-red-500' : lead.ai_score === 'warm' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {lead.ai_score}
                        </span>
                      </div>

                      <div className="text-[10px] text-gray-500 space-y-1">
                        <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> {lead.phone}</div>
                        <div className="flex items-center gap-1 uppercase font-semibold text-gold-light dark:text-gold-dark">
                          <MapPin className="w-3 h-3"/> {lead.preferred_location}
                        </div>
                        {lead.budget_max && (
                          <div className="font-bold text-gray-700 dark:text-gray-300">
                            Budget: ₹{(lead.budget_max / 100000).toFixed(1)}L max
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs italic">
                    No leads at this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CRM Console side panel details */}
      {selectedLead && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-colors">
          
          {/* Left panel: Lead specifications & details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-gold-light" />
                  <span>{selectedLead.first_name} {selectedLead.last_name || ''}</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">Lead Details Panel</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>

            <div className="text-xs space-y-3.5 border-y py-4 border-gray-100 dark:border-gray-800">
              <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="font-bold">{selectedLead.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="font-bold text-gray-600 dark:text-gray-300">{selectedLead.email || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Budget</span><span className="font-bold">₹{selectedLead.budget_min?.toLocaleString()} - ₹{selectedLead.budget_max?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Preferred Location</span><span className="font-bold text-gold-light">{selectedLead.preferred_location || 'Tambaram'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Preferred Type</span><span className="font-bold uppercase">{selectedLead.preferred_project_type || 'Plot'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Source</span><span className="font-bold uppercase tracking-wider">{selectedLead.lead_source.replace('_', ' ')}</span></div>
            </div>

            {/* AI Summary Block */}
            <div className="bg-gold-light/5 border border-gold-light/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-light">
                <Sparkles className="w-4 h-4 text-gold-light" />
                <span>AI Scoring Analysis ({selectedLead.ai_score.toUpperCase()})</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {selectedLead.ai_score_reason || 'AI summary analysis evaluating budgets, location preferences, and user details.'}
              </p>
            </div>

            {/* Quick Stage Mover Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Move Pipeline Stage</label>
              <select
                value={selectedLead.lead_stage}
                onChange={(e) => updateLeadStage(selectedLead.id, e.target.value as StageType)}
                className="w-full px-3 py-2 border border-gray-250 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs font-semibold rounded-lg focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Center/Right Panel: Interaction logs & Booking panel */}
          <div className="lg:col-span-8 space-y-8 lg:border-l lg:pl-8 border-gray-100 dark:border-gray-800">
            
            {/* Booking Form (Only show in negotiation/booking phase) */}
            {selectedLead.lead_stage === 'negotiation' && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="w-4 h-4" /> Convert to Booking Order
                </h4>
                <form onSubmit={handleCreateBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 block">Select Available Plot</label>
                    <select
                      required
                      value={bookingPropertyId}
                      onChange={(e) => setBookingPropertyId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] text-xs font-semibold rounded-lg focus:outline-none"
                    >
                      <option value="">-- Choose Unit --</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.property_number} ({p.area_sqft} sqft)</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 block">Agreed Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={bookingAgreedPrice}
                      onChange={(e) => setBookingAgreedPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] text-xs font-semibold rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 block">Advance Token Paid</label>
                    <input
                      type="number"
                      required
                      value={bookingAdvance}
                      onChange={(e) => setBookingAdvance(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] text-xs font-semibold rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow"
                    >
                      Confirm Plot Reservation Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Interaction Follow-up Logging */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Log Call / Interaction</h4>
              <form onSubmit={handleLogFollowUp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 block">Type</label>
                    <select
                      value={interactionType}
                      onChange={(e) => setInteractionType(e.target.value as LeadHistory['interaction_type'])}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs font-semibold rounded-lg focus:outline-none"
                    >
                      <option value="call">Call Log</option>
                      <option value="whatsapp_sent">WhatsApp Sent</option>
                      <option value="site_visit_note">Site Visit Feedback</option>
                      <option value="negotiation_note">Negotiation Notes</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[9px] font-bold uppercase text-gray-400 block">Next Follow-up Reminder</label>
                    <input
                      type="datetime-local"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs font-semibold rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter summary logs..."
                    value={interactionNotes}
                    onChange={(e) => setInteractionNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-charcoal hover:bg-charcoal/95 dark:bg-gold-dark dark:hover:bg-gold-dark/95 text-white dark:text-charcoal rounded-lg text-xs font-bold transition-all shadow"
                >
                  Save Log entry
                </button>
              </form>
            </div>

            {/* Follow-up History Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Interaction Logs Timeline</h4>
              <div className="space-y-4 max-h-[35vh] overflow-y-auto no-scrollbar">
                {selectedLeadHistory.length > 0 ? (
                  selectedLeadHistory.map((hist) => (
                    <div
                      key={hist.id}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-850/10 flex items-start gap-3 text-xs"
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shrink-0">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="space-y-1 flex-grow">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                          <span>{hist.interaction_type.replace('_', ' ')}</span>
                          <span>{new Date(hist.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                          {hist.summary_en}
                        </p>
                        {hist.next_follow_up_date && (
                          <div className="text-[10px] font-bold text-amber-500">
                            ★ Reminder: Follow-up scheduled at {new Date(hist.next_follow_up_date).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs italic">
                    No history entries logged
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add New Lead Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-850 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Lead Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Vignesh"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Last Name</label>
                <input
                  type="text"
                  placeholder="Rao"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Phone *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9994115154"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Email</label>
                <input
                  type="email"
                  placeholder="vignesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Budget (INR)</label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                >
                  <option value="2500000">₹25 Lakhs max</option>
                  <option value="4000000">₹40 Lakhs max</option>
                  <option value="7500000">₹75 Lakhs max</option>
                  <option value="15000000">Above ₹75 Lakhs</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Preferred Type</label>
                <select
                  value={prefType}
                  onChange={(e) => setPrefType(e.target.value as 'plot' | 'villa' | 'farmland' | 'any')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                >
                  <option value="plot">Plot</option>
                  <option value="villa">Villa</option>
                  <option value="farmland">Farmland</option>
                  <option value="any">Any</option>
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Preferred Location</label>
                <input
                  type="text"
                  placeholder="e.g. Tambaram East"
                  value={prefLoc}
                  onChange={(e) => setPrefLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Customer Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enter details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                ></textarea>
              </div>
              <div className="sm:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-gold-light hover:bg-gold-hover text-gray-900 font-bold rounded-lg text-xs tracking-wider uppercase shadow"
                >
                  Save Lead Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LeadsCRM() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-light"></div></div>}>
      <LeadsCRMContent />
    </React.Suspense>
  );
}
