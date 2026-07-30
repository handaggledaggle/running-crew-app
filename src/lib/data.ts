export type Pace = '초보' | '중급' | '고급';

export interface Meetup {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  pace: Pace;
  capacity: number;
  registered: number;
  description: string;
  leader: string;
}

export interface Participant {
  id: string;
  name: string;
  appliedAt: string;
  attended: boolean;
}

export interface RunRecord {
  id: string;
  date: string;
  distance: number;
  duration: string;
  avgPace: string;
}

export interface Notice {
  id: string;
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

export const meetups: Meetup[] = [
  { id: '1', title: '마포 한강 저녁 러닝', date: '2026-07-30', time: '19:30', location: '마포 한강공원 주차장', pace: '중급', capacity: 12, registered: 8, description: '한강변을 따라 6km 코스로 달립니다.', leader: '김민준' },
  { id: '2', title: '성수 공장길 아침 달리기', date: '2026-07-31', time: '06:30', location: '성수역 2번 출구', pace: '초보', capacity: 10, registered: 3, description: '성수동 골목길 5km 가볍게 달려요.', leader: '이서연' },
  { id: '3', title: '송파 올림픽공원 스피드런', date: '2026-08-01', time: '07:00', location: '올림픽공원 평화의문', pace: '고급', capacity: 8, registered: 7, description: '5분 페이스 이하 멤버 환영.', leader: '박지훈' },
  { id: '4', title: '홍대 저녁 달리기 크루', date: '2026-08-02', time: '20:00', location: '홍대입구역 9번 출구', pace: '초보', capacity: 15, registered: 5, description: '홍대~합정 6km 야경 러닝.', leader: '최예진' },
];

export const participants: Participant[] = [
  { id: '1', name: '김민준', appliedAt: '2026-07-28', attended: true },
  { id: '2', name: '이서연', appliedAt: '2026-07-28', attended: true },
  { id: '3', name: '박지훈', appliedAt: '2026-07-29', attended: false },
  { id: '4', name: '최예진', appliedAt: '2026-07-29', attended: false },
  { id: '5', name: '정현우', appliedAt: '2026-07-29', attended: false },
  { id: '6', name: '한소희', appliedAt: '2026-07-30', attended: false },
  { id: '7', name: '오태양', appliedAt: '2026-07-30', attended: false },
  { id: '8', name: '윤아름', appliedAt: '2026-07-30', attended: false },
];

export const runRecords: RunRecord[] = [
  { id: '1', date: '2026-07-28', distance: 6.2, duration: '37:12', avgPace: '6:00' },
  { id: '2', date: '2026-07-25', distance: 5.0, duration: '28:30', avgPace: '5:42' },
  { id: '3', date: '2026-07-22', distance: 8.0, duration: '50:24', avgPace: '6:18' },
  { id: '4', date: '2026-07-19', distance: 4.5, duration: '26:45', avgPace: '5:57' },
];

export const notices: Notice[] = [
  { id: '1', author: '김민준 (리더)', date: '2026-07-29', title: '이번 주 마포 러닝 코스 변경 안내', content: '한강 수위 상승으로 코스를 월드컵공원 방향으로 변경합니다. 집결 장소는 동일합니다.', likes: 12, comments: 5 },
  { id: '2', author: '김민준 (리더)', date: '2026-07-27', title: '7월 월간 기록 정산 완료!', content: '이번 달 총 23명이 참여했고 합산 거리는 287km입니다. 모두 수고하셨습니다 🏃', likes: 31, comments: 8 },
  { id: '3', author: '이서연', date: '2026-07-25', title: '러닝 후 치맥 번개 (희망자 모집)', content: '성수 달리기 후 근처 치킨집 번개 어때요? 댓글로 참여 의사 남겨주세요.', likes: 18, comments: 14 },
];

export const totalDistance = runRecords.reduce((s, r) => s + r.distance, 0);
export const monthDistance = 6.2 + 5.0 + 8.0;
