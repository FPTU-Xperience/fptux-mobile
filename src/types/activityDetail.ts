// types/activityDetail.ts
import type { ActivityStatus } from './activity';

export type DetailTabKey = 'overview' | 'documents' | 'media' | 'assignments' | 'recruitment';

export interface DetailDateTime {
  /** vd: "14:00:00" */
  time: string;
  /** vd: "12/11/2026" */
  date: string;
}

export interface RecruitmentRole {
  id: string;
  title: string;
  kind: string;
  approved: number;
  capacity: number;
  note: string;
}

export interface Recruitment {
  open: boolean;
  description: string;
  notice: string;
  visibility: string;
  roles: RecruitmentRole[];
}

export interface Assignment {
  id: string;
  name: string;
  initials: string;
  roleLabel: string;
  duty: string;
  avatarBg: string;
  avatarColor: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  meta: string;
}

export interface MediaItem {
  id: string;
  title: string;
  kind: 'image' | 'video';
}

export interface AttendanceInfo {
  count: number;
  emptyText: string;
  sessionHint: string;
}

export interface ActivityDetail {
  id: string;
  title: string;
  status: ActivityStatus;
  bannerColor: string;
  hubLabel: string;
  day: string;
  /** Số tháng, vd: "11" */
  month: string;
  clubName: string;
  /** vd: "14:00 12/11/2026" */
  timeSummary: string;
  startAt: DetailDateTime;
  endAt: DetailDateTime;
  location: string;
  organizer: string;
  about: string;
  contactNote: string;
  recruitment: Recruitment;
  assignmentsNote: string;
  assignments: Assignment[];
  attendance: AttendanceInfo;
  documents: DocumentItem[];
  media: MediaItem[];
}

export interface RegisterState {
  registered: boolean;
  loading: boolean;
  disabled: boolean;
}