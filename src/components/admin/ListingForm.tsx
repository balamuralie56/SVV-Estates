'use client';

import { useState } from 'react';
import { supabase, type ListingRow } from '@/lib/supabase';

export type ListingFormValues = Omit<ListingRow, 'id' | 'created_at' | 'updated_at'>;

/** Keeps slugs safe for use in a URL query string: lowercase, hyphenated, no slashes/spaces. */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const emptyForm: ListingFormValues = {
  slug: '',
  title_en: '',
  title_ta: '',
  description_en: '',
  description_ta: '',
  location_en: '',
  location_ta: '',
  map_url: '',
  plot_size_sqft: null,
  price_per_sqft: null,
  price_total: null,
  price_on_request: true,
  status: 'available',
  patta_status: null,
  ec_status: null,
  notes: '',
  published: false,
};

export default function ListingForm({
  initial,
  listingId,
  onSaved,
  onCancel,
}: {
  initial?: ListingRow;
  listingId?: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ListingFormValues>(() =>
    initial
      ? {
          slug: initial.slug,
          title_en: initial.title_en,
          title_ta: initial.title_ta,
          description_en: initial.description_en,
          description_ta: initial.description_ta,
          location_en: initial.location_en,
          location_ta: initial.location_ta,
          map_url: initial.map_url ?? '',
          plot_size_sqft: initial.plot_size_sqft,
          price_per_sqft: initial.price_per_sqft,
          price_total: initial.price_total,
          price_on_request: initial.price_on_request,
          status: initial.status,
          patta_status: initial.patta_status,
          ec_status: initial.ec_status,
          notes: initial.notes ?? '',
          published: initial.published,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      slug: slugify(form.slug),
      map_url: form.map_url || null,
      notes: form.notes || null,
    };

    const { error: saveError } = listingId
      ? await supabase.from('listings').update(payload).eq('id', listingId)
      : await supabase.from('listings').insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    onSaved();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-surface-dark p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Slug (URL, lowercase letters/numbers/hyphens only)">
          <input
            name="slug"
            required
            value={form.slug}
            onChange={(e) => update('slug', slugify(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select
            name="status"
            value={form.status}
            onChange={(e) => update('status', e.target.value as ListingFormValues['status'])}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="sold">Sold</option>
          </select>
        </Field>

        <Field label="Title (English)">
          <input name="title_en" required value={form.title_en} onChange={(e) => update('title_en', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Title (Tamil)">
          <input name="title_ta" required value={form.title_ta} onChange={(e) => update('title_ta', e.target.value)} className={inputClass} />
        </Field>

        <Field label="Location / general area (English)">
          <input name="location_en" required value={form.location_en} onChange={(e) => update('location_en', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Location / general area (Tamil)">
          <input name="location_ta" required value={form.location_ta} onChange={(e) => update('location_ta', e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Description (English)">
        <textarea name="description_en" rows={3} value={form.description_en} onChange={(e) => update('description_en', e.target.value)} className={inputClass} />
      </Field>
      <Field label="Description (Tamil)">
        <textarea name="description_ta" rows={3} value={form.description_ta} onChange={(e) => update('description_ta', e.target.value)} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Plot size (sqft)">
          <input
            name="plot_size_sqft"
            type="number"
            min={0}
            value={form.plot_size_sqft ?? ''}
            onChange={(e) => update('plot_size_sqft', e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          />
        </Field>
        <Field label="Price per sqft (₹, approx)">
          <input
            name="price_per_sqft"
            type="number"
            min={0}
            value={form.price_per_sqft ?? ''}
            onChange={(e) => update('price_per_sqft', e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          />
        </Field>
        <Field label="Total price (₹, approx)">
          <input
            name="price_total"
            type="number"
            min={0}
            value={form.price_total ?? ''}
            onChange={(e) => update('price_total', e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          name="price_on_request"
          type="checkbox"
          checked={form.price_on_request}
          onChange={(e) => update('price_on_request', e.target.checked)}
        />
        Show price as &quot;on request&quot; instead of the figures above
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Patta status (optional — leave blank until confirmed)">
          <input
            name="patta_status"
            value={form.patta_status ?? ''}
            onChange={(e) => update('patta_status', e.target.value || null)}
            className={inputClass}
          />
        </Field>
        <Field label="EC status (optional — leave blank until confirmed)">
          <input
            name="ec_status"
            value={form.ec_status ?? ''}
            onChange={(e) => update('ec_status', e.target.value || null)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Google Maps URL (optional, general area only)">
        <input name="map_url" value={form.map_url ?? ''} onChange={(e) => update('map_url', e.target.value)} className={inputClass} />
      </Field>

      <Field label="Internal notes (not shown publicly)">
        <textarea name="notes" rows={2} value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
        <input name="published" type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
        Published (visible on the public site)
      </label>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? 'Saving…' : listingId ? 'Save changes' : 'Create listing'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-accent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-gray-300">{label}</span>
      {children}
    </label>
  );
}
