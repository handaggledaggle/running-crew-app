export type MeetingItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  district: string;
  pace: string;
  capacity: number;
  leader: string;
  memo: string | null;
  joined: number;
};

export type ParticipantItem = {
  id: number;
  userName: string;
  userAvatar: string;
  attended: boolean | null;
};

export type RunningRecordItem = {
  id: number;
  date: string;
  distanceKm: number;
  durationMin: number;
  memo: string | null;
};

export type NoticeItem = {
  id: number;
  author: string;
  role: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  liked: boolean;
};
