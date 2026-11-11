// types/club.ts
export type ClubFilterKey = 'all' | 'academic' | 'tech' | 'community' | 'arts';
export type ClubIconKind = 'presentation' | 'music' | 'megaphone';
export type TagTone = 'neutral' | 'success' | 'warning';

export interface ClubTag {
  label: string;
  tone: TagTone;
}

export interface Club {
  id: string;
  code: string;
  name: string;
  /** Nhãn danh mục trên banner, vd: "CÔNG NGHỆ & PHẦN MỀM" */
  categoryLabel: string;
  groups: ClubFilterKey[];
  bannerColor: string;
  quote: string;
  iconKind: ClubIconKind;
  iconBg: string;
  /** Chữ nhỏ dưới icon, vd: "BEAT" */
  iconLabel?: string;
  tags: ClubTag[];
  schedule: string;
  description: string;
  recruiting: boolean;
}

export interface ClubFilter {
  key: ClubFilterKey;
  label: string;
}

export interface ClubFeed {
  campus: string;
  total: number;
  clubs: Club[];
  filters: ClubFilter[];
}

export interface FetchClubsParams {
  keyword?: string;
  filter?: ClubFilterKey;
  recruitingOnly?: boolean;
}