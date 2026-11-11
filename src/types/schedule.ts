// types/schedule.ts
export type ScheduleTabKey = 'upcoming' | 'attended';
export type TicketStatus = 'confirmed' | 'pending' | 'attended';
export type TicketAction = 'qr' | 'ticket';

export interface ScheduleEvent {
  id: string;
  day: string;
  /** Vd: "TH 11" */
  month: string;
  dateBoxBg: string;
  dateBoxColor: string;
  club: string;
  category: string;
  name: string;
  time: string;
  venue: string;
  status: TicketStatus;
  action: TicketAction;
}

export interface ScheduleFeed {
  campus: string;
  upcomingThisWeek: ScheduleEvent[];
  upcomingNextWeek: ScheduleEvent[];
  attended: ScheduleEvent[];
}