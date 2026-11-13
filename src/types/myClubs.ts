// types/myClubs.ts
export type ApplicationTabKey = 'pending' | 'approved' | 'history';
export type ApplicationResult = 'pending' | 'approved' | 'rejected';

export interface MyClubActivity {
  /** Trùng id hoạt động (để mở màn chi tiết hoạt động) */
  id: string;
  title: string;
  date: string;
}

export interface MyClub {
  id: string;
  name: string;
  role: string;
  subtitle: string | null;
  hubLabel: string;
  tagline: string;
  bannerColor: string;
  logoBg: string;
  logoCode: string;
  nextActivity: MyClubActivity | null;
}

export interface Application {
  id: string;
  clubId: string;
  clubName: string;
  appliedAt: string;
  tab: ApplicationTabKey;
  result: ApplicationResult;
}

export interface FeaturedClub {
  id: string;
  name: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  description: string;
}

export interface MyClubsFeed {
  clubs: MyClub[];
  applications: Application[];
  featured: FeaturedClub[];
}