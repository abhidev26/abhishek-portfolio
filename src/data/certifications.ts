export type IconKey = 'shield' | 'brain' | 'rocket' | 'pen' | 'calendar' | 'users';

export interface Certification {
  id: string;
  issuer: string;
  title: string;
  icon: IconKey;
}
export interface Achievement {
  id: string;
  title: string;
  icon: IconKey;
}

/** No dates, credential IDs or rankings are listed because none were supplied. */
export const CERTIFICATIONS: readonly Certification[] = [
  { id: 'palo-alto', issuer: 'ICT Academy', title: 'Palo Alto Networks Cybersecurity Academy', icon: 'shield' },
  { id: 'ibm-ai', issuer: 'IBM', title: 'Getting Started with Artificial Intelligence', icon: 'brain' },
] as const;

export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'hackathon', title: 'Hackathon Participant', icon: 'rocket' },
  { id: 'digital-design', title: 'Digital Design Participant', icon: 'pen' },
  { id: 'event-coordinator', title: 'College Event Coordinator', icon: 'calendar' },
  { id: 'activity-leader', title: 'Activity Leader', icon: 'users' },
] as const;
