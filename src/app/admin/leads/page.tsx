'use client';

import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { supabase, type LeadRow } from '@/lib/supabase';

const STATUS_STYLES: Record<LeadRow['status'], string> = {
  new: 'bg-amber-500/15 text-amber-400',
  contacted: 'bg-accent/15 text-accent',
  closed: 'bg-emerald-500/15 text-emerald-400',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | LeadRow['status']>('all');

  const loadLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLeads(data as LeadRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only happens after the await inside loadLeads
    loadLeads();
  }, []);

  const updateStatus = async (id: string, status: LeadRow['status']) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    loadLeads();
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter((l) => l.status === filter);
  const optedInCount = leads.filter((l) => l.marketing_opt_in).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <p className="text-xs text-gray-400">
            {leads.length} total · {optedInCount} opted in to marketing updates
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === status ? 'bg-accent text-white' : 'border border-white/15 text-gray-300 hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading leads…</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-sm text-gray-400">No leads yet.</p>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-white/10 bg-surface-dark p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{lead.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[lead.status]}`}>
                      {lead.status}
                    </span>
                    {lead.marketing_opt_in && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                        Opted in
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {lead.email}
                      </span>
                    )}
                    {lead.listing_title && <span>· {lead.listing_title}</span>}
                    <span>· {new Date(lead.created_at).toLocaleString('en-IN')}</span>
                  </div>
                  {lead.message && <p className="max-w-xl text-sm text-gray-300">{lead.message}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/15 p-2 text-emerald-400 hover:bg-white/5"
                    aria-label="Open WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as LeadRow['status'])}
                    className="rounded-lg border border-white/15 bg-ink px-2 py-1.5 text-xs text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
