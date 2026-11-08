import { supabase, type LeadRow } from './supabase';

export interface SubmitLeadInput {
  name: string;
  phone: string;
  email?: string | null;
  source: LeadRow['source'];
  listingSlug?: string | null;
  listingTitle?: string | null;
  message?: string | null;
  marketingOptIn: boolean;
}

/**
 * Writes a lead to Supabase. Leads are write-only from the public side
 * (RLS allows insert, not select) -- this never blocks the caller's own
 * flow (e.g. opening WhatsApp) on success; callers should fire this and
 * proceed regardless, only using the returned ok flag to decide whether
 * to mention a save issue.
 */
export async function submitLead(input: SubmitLeadInput): Promise<{ ok: boolean }> {
  const { error } = await supabase.from('leads').insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    source: input.source,
    listing_slug: input.listingSlug || null,
    listing_title: input.listingTitle || null,
    message: input.message || null,
    marketing_opt_in: input.marketingOptIn,
  });

  if (error) {
    console.error('Failed to save lead', error);
    return { ok: false };
  }
  return { ok: true };
}
