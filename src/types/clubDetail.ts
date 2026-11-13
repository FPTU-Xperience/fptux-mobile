// types/clubDetail.ts
export interface ClubHighlight {
  no: string;
  title: string;
  description: string;
}

export interface ClubMeetInfo {
  schedule: string;
  /** null = chưa cập nhật địa điểm */
  location: string | null;
  size: string;
  email: string;
  hotline: string;
}

export interface ClubUpcomingEvent {
  /** Trùng id hoạt động (để mở màn chi tiết hoạt động) */
  id: string;
  day: string;
  /** vd: "T11" */
  month: string;
  title: string;
  time: string;
  venue: string;
}

export interface ClubLeader {
  id: string;
  name: string;
  initials: string;
  term: string;
}

export interface ClubDetail {
  id: string;
  name: string;
  eyebrow: string;
  tagline: string;
  slogan: string;
  bannerColor: string;
  logoBg: string;
  logoCode: string;
  campusLabel: string;
  category: string;
  recruiting: boolean;
  recruitingLabel: string;
  /** vd: "Thứ Tư & Thứ Bảy · 18:00-20:00" */
  scheduleSummary: string;
  location: string | null;
  aboutHeading: string;
  aboutText: string;
  hashtags: string[];
  highlights: ClubHighlight[];
  meet: ClubMeetInfo;
  upcomingEvents: ClubUpcomingEvent[];
  leaders: ClubLeader[];
}

export interface ApplyState {
  applied: boolean;
  loading: boolean;
  /** true khi CLB chưa mở tuyển */
  disabled: boolean;
}