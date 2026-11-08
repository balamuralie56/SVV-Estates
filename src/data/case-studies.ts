import type { LocalizedText } from '@/lib/listings';

export interface CaseStudy {
  id: string;
  period: LocalizedText;
  location: LocalizedText;
  role: LocalizedText;
  propertyType: LocalizedText;
  description: LocalizedText;
  evidenceReviewed: boolean;
  publicationPermissionReviewed: boolean;
  photos: string[];
}

// Historical projects can be added after internal evidence and publication
// permission review. Do not add customer names, signatures, deeds, or raw FMB
// sketches to this public file.
export const publicCaseStudies: readonly CaseStudy[] = [];
