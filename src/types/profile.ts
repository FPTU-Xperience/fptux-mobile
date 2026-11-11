// types/profile.ts
export type ProfileTabKey = 'overview' | 'evidence';
export type StatIconKind = 'zap' | 'star' | 'check' | 'users';
export type MenuIconKind = 'flag' | 'calendar' | 'trophy';

export interface ProfileUser {
  name: string;
  initials: string;
  plan: string;
  statusLabel: string;
  major: string;
  cohort: string;
  campusCode: string;
  university: string;
  campusName: string;
  bio: string;
  coverText: string;
}

export interface ProfileStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  iconKind: StatIconKind;
}

export interface CompetencyAxis {
  label: string;
  /** 0 - 100 */
  value: number;
}

export interface Competency {
  quote: string;
  axes: CompetencyAxis[];
  depth: number;
  evenness: number;
  factor: number;
  note: string;
}

export interface ProfileClub {
  id: string;
  name: string;
  field: string;
  badge: string;
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  count?: number;
  iconKind: MenuIconKind;
}

export interface Evidence {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface ProfileFeed {
  campus: string;
  user: ProfileUser;
  stats: ProfileStat[];
  competency: Competency;
  skills: string[];
  clubs: ProfileClub[];
  menu: ProfileMenuItem[];
  evidences: Evidence[];
}