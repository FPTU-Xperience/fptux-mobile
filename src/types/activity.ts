// types/activity.ts
export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended';
export type ActivityCategory = 'hackathon' | 'music' | 'workshop';
export type VenueKind = 'pin' | 'music' | 'users';
export type FooterKind = 'attendees' | 'likes' | 'perk';
export type FilterKey = 'all' | 'upcoming' | 'ongoing' | 'workshop';

export interface ActivityEvent {
  id: string;
  club: string;
  status: ActivityStatus;
  category: ActivityCategory;
  title: string;
  /** Dòng địa điểm nhỏ ở banner, vd: "HAN - Sảnh Innovation & Tòa Gamma" */
  bannerLocation: string;
  bannerColor: string;
  day: string;
  month: string;
  dateBoxBg: string;
  dateBoxColor: string;
  organizer: string;
  name: string;
  time: string;
  venue: { kind: VenueKind; label: string };
  footer: { kind: FooterKind; label: string };
}

export interface ActivityFilter {
  key: FilterKey;
  label: string;
}

export interface ActivityFeed {
  campus: string;
  semester: string;
  events: ActivityEvent[];
  filters: ActivityFilter[];
}

export interface FetchActivitiesParams {
  keyword?: string;
  filter?: FilterKey;
}