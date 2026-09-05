/**
 * Core Domain Entity Types
 * Mapped directly to PRD §13 and §14.
 */

export type AdminRole =
  | "Super Admin"
  | "Administrator"
  | "Content Editor"
  | "Sales/Business Dev"
  | "Studio Manager"
  | "Marketing Manager"
  | "Analyst/Viewer";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Discovery Scheduled"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Nurture"
  | "Spam";

/**
 * Quality Tier definitions:
 * 0 = Static fallback only (reduced motion, low memory <2GB, or disabled by user)
 * 1 = Optimized 3D (mobile, dpr 1.5, simplified lighting)
 * 2 = High-fidelity 3D (desktop, dpr 2.0, pointer tracking, rich materials)
 */
export type QualityTier = 0 | 1 | 2;

export interface SceneCopy {
  number: string;
  name: string;
  dialogue: string | null;
}

