'use client';

import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase, type ListingRow } from '@/lib/supabase';
import ListingForm from '@/components/admin/ListingForm';
import MediaManager from '@/components/admin/MediaManager';

export default function AdminDashboard() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedMediaId, setExpandedMediaId] = useState<string | null>(null);

  const loadListings = async () => {
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setListings(data as ListingRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only happens after the await inside loadListings
    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this listing and its media? This cannot be undone.')) return;
    await supabase.from('listings').delete().eq('id', id);
    loadListings();
  };

  const editingListing = listings.find((l) => l.id === editingId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Listings</h2>
          <p className="text-xs text-gray-400">
            Only listings marked &quot;Published&quot; appear on the public site.
          </p>
        </div>
        {!creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-hover sm:py-2"
          >
            <Plus className="h-4 w-4" /> Add listing
          </button>
        )}
      </div>

      {creating && (
        <ListingForm
          onCancel={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            loadListings();
          }}
        />
      )}

      {editingListing && (
        <ListingForm
          listingId={editingListing.id}
          initial={editingListing}
          onCancel={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            loadListings();
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading listings…</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-gray-400">No listings yet. Add the first one above.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="rounded-xl border border-white/10 bg-surface-dark p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white break-words">{listing.title_en}</h3>
                    <StatusBadge status={listing.status} />
                    {!listing.published && (
                      <span className="rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-300">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="break-all text-xs text-gray-400">
                    {listing.location_en} · /projects/listing?slug={listing.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedMediaId(expandedMediaId === listing.id ? null : listing.id)}
                    className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-white/5 sm:flex-none sm:py-1.5"
                  >
                    Media
                  </button>
                  <button
                    onClick={() => setEditingId(listing.id)}
                    className="rounded-lg border border-white/15 p-2.5 text-gray-200 hover:bg-white/5 sm:p-2"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="rounded-lg border border-red-500/30 p-2.5 text-red-400 hover:bg-red-500/10 sm:p-2"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {expandedMediaId === listing.id && (
                <div className="mt-4">
                  <MediaManager listingId={listing.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ListingRow['status'] }) {
  const styles: Record<ListingRow['status'], string> = {
    available: 'bg-emerald-500/15 text-emerald-400',
    booked: 'bg-amber-500/15 text-amber-400',
    sold: 'bg-red-500/15 text-red-400',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${styles[status]}`}>{status}</span>
  );
}
