export type Pace = '초보' | '중급' | '고급';
export type District = '강남구' | '서초구' | '마포구' | '송파구' | '용산구';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  district: District;
  pace: Pace;
  paceMin: string;
  capacity: number;
  participants: number;
  description: string;
  leader: string;
  leaderAvatar: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  attended: boolean;
}

export interface RunRecord {
  id: string;
  date: string;
  distance: number;
  duration: number;
  pace: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

export const MEETINGS: Meeting[] = [
  { id: 'm1', title: '한강 공원 새벽 러닝', date: '2026-08-03', time: '06:00', location: '여의도 한강공원 이벤트광장', district: '마포구', pace: '중급', paceMin: '6:00', capacity: 15, participants: 9, description: '여의도 한강변을 5km 달리는 모임입니다. 스트레칭 후 출발!', leader: '김러닝', leaderAvatar: 'KR' },
  { id: 'm2', title: '강남 코어 러닝 크루', date: '2026-08-05', time: '07:00', location: '강남역 1번 출구 앞', district: '강남구', pace: '고급', paceMin: '5:00', capacity: 10, participants: 7, description: '강남 근처 코스를 빠른 페이스로 7km 달립니다.', leader: '박스피드', leaderAvatar: 'PS' },
  { id: 'm3', title: '초보 러너 모여라!', date: '2026-08-06', time: '18:30', location: '서울숲 정문', district: '용산구', pace: '초보', paceMin: '7:30', capacity: 20, participants: 12, description: '처음 달리는 분들 환영해요! 3km 천천히 같이 달려요.', leader: '이조이', leaderAvatar: 'IJ' },
  { id: 'm4', title: '서초 저녁 러닝', date: '2026-08-07', time: '19:00', location: '반포한강공원 세빛둥둥섬', district: '서초구', pace: '중급', paceMin: '6:30', capacity: 12, participants: 4, description: '반포 한강변 야경 보며 달리기! 5km 코스.', leader: '최리버', leaderAvatar: 'CR' },
];

export const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: '김민준', avatar: 'KM', attended: true },
  { id: 'p2', name: '이서연', avatar: 'LS', attended: false },
  { id: 'p3', name: '박지훈', avatar: 'PJ', attended: true },
  { id: 'p4', name: '최수아', avatar: 'CS', attended: false },
  { id: 'p5', name: '정도현', avatar: 'JD', attended: true },
  { id: 'p6', name: '한예린', avatar: 'HY', attended: false },
  { id: 'p7', name: '오준서', avatar: 'OJ', attended: false },
  { id: 'p8', name: '윤채원', avatar: 'YC', attended: true },
  { id: 'p9', name: '임현우', avatar: 'IH', attended: false },
];

export const RUN_RECORDS: RunRecord[] = [
  { id: 'r1', date: '2026-07-29', distance: 5.2, duration: 31, pace: '5:58' },
  { id: 'r2', date: '2026-07-26', distance: 7.0, duration: 44, pace: '6:17' },
  { id: 'r3', date: '2026-07-22', distance: 3.5, duration: 24, pace: '6:51' },
  { id: 'r4', date: '2026-07-19', distance: 10.0, duration: 62, pace: '6:12' },
  { id: 'r5', date: '2026-07-14', distance: 5.0, duration: 30, pace: '6:00' },
];

export const MONTHLY_STATS = [
  { month: '3월', km: 42 },
  { month: '4월', km: 55 },
  { month: '5월', km: 68 },
  { month: '6월', km: 49 },
  { month: '7월', km: 30.7 },
];

export const NOTICES: Notice[] = [
  { id: 'n1', title: '8월 정기 크루런 안내', content: '이번 달 정기 크루런은 8월 10일(일) 오전 7시, 한강 여의도 공원에서 진행됩니다. 참가 신청은 앱 내 모임 탭에서 해주세요!', date: '2026-07-28', likes: 24, comments: 8, isPinned: true },
  { id: 'n2', title: '크루 운동복 공동구매 마감 임박', content: '크루 단체 운동복 공동구매 마감이 8월 5일입니다. 미신청자는 서둘러 참여해 주세요.', date: '2026-07-25', likes: 15, comments: 5 },
  { id: 'n3', title: '7월 러닝 챌린지 결과 발표', content: '7월 100km 달리기 챌린지 결과를 발표합니다. 1위: 김민준(127km), 2위: 박지훈(115km), 3위: 이서연(108km)!', date: '2026-07-20', likes: 41, comments: 18 },
];
