// types/recommendation.ts
export type RecoEventStatus = 'upcoming' | 'ongoing';
export type RecoEventFilterKey = 'all' | RecoEventStatus;
export type RecoClubCategoryKey = 'all' | 'academic' | 'tech' | 'community';
export type QuickActionIcon = 'compass' | 'calendar' | 'users';
export type QuickActionRoute = 'activity' | 'schedule' | 'allClubs';

export interface RecoFilter<T extends string> {
  key: T;
  label: string;
}

export interface RecoMiniCard {
  id: string;
  label: string;
  title: string;
  note?: string;
  tone: 'dark' | 'light';
}

export interface RecoHero {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  miniCards: RecoMiniCard[];
  socialProof: {
    avatars: string[];
    text: string;
  };
}

export interface RecoQuickAction {
  id: string;
  label: string;
  icon: QuickActionIcon;
  route: QuickActionRoute;
}

export interface RecoEvent {
  id: string;
  club: string;
  status: RecoEventStatus;
  title: string;
  bannerLocation: string;
  bannerColor: string;
  day: string;
  /** Số tháng, vd: "11" */
  month: string;
  dateBoxBg: string;
  dateBoxColor: string;
  name: string;
  time: string;
  venue: string;
}

export interface RecoClub {
  id: string;
  code: string;
  name: string;
  category: RecoClubCategoryKey;
  categoryLabel: string;
  recruiting: boolean;
  recruitingLabel: string;
  hubLabel: string;
  tagline: string;
  bannerColor: string;
  logoBg: string;
  logoText: string;
  /** null = chưa cập nhật lịch */
  schedule: string | null;
  description: string;
}

export interface RecoPagination {
  page: number;
  pageCount: number;
  total: number;
}

export interface RecoMoreCta {
  eyebrow: string;
  text: string;
  button: string;
}

/** Tham số query của GET /recommendation */
export interface RecommendationQuery {
  eventStatus?: RecoEventFilterKey;
  keyword?: string;
  category?: RecoClubCategoryKey;
  page?: number;
}

/** Response của GET /recommendation */
export interface RecommendationResponse {
  campus: string;
  hero: RecoHero;
  quickActions: RecoQuickAction[];
  events: {
    filters: RecoFilter<RecoEventFilterKey>[];
    items: RecoEvent[];
  };
  clubs: {
    filters: RecoFilter<RecoClubCategoryKey>[];
    items: RecoClub[];
    pagination: RecoPagination;
  };
  moreCta: RecoMoreCta;
}