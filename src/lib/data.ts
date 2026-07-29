export const meetings = [
  { id: '1', title: '홍대 저녁 러닝', date: '오늘 19:30', location: '홍대 걷고싶은거리', pace: '6:00/km', slots: 8, joined: 5, distance: '5km', tags: ['초급', '서울 마포'] },
  { id: '2', title: '한강 새벽 달리기', date: '내일 06:00', location: '여의도 한강공원', pace: '5:30/km', slots: 10, joined: 7, distance: '8km', tags: ['중급', '서울 영등포'] },
  { id: '3', title: '북한산 트레일', date: '토 07:00', location: '북한산 입구', pace: '7:00/km', slots: 6, joined: 3, distance: '10km', tags: ['중상급', '서울 강북'] },
];

export const attendees = [
  { id: '1', name: '김민준', avatar: '🏃', checked: true },
  { id: '2', name: '이서연', avatar: '🏃‍♀️', checked: true },
  { id: '3', name: '박도현', avatar: '🏃', checked: false },
  { id: '4', name: '최유진', avatar: '🏃‍♀️', checked: false },
  { id: '5', name: '정우성', avatar: '🏃', checked: false },
];

export const runHistory = [
  { id: '1', date: '7/28', distance: 8.2, duration: '49:12', memo: '한강 저녁' },
  { id: '2', date: '7/26', distance: 5.0, duration: '31:00', memo: '동네 한 바퀴' },
  { id: '3', date: '7/24', distance: 10.5, duration: '63:30', memo: '장거리 도전' },
];

export const notices = [
  { id: '1', title: '이번 주 토요일 단체 달리기 확정!', content: '참가 신청하신 분들 모두 취합됐습니다. 당일 7시 정각 출발예정이니 6:50까지 집합해주세요.', date: '7/29', author: '크루장 김민준' },
  { id: '2', title: '7월 러닝 결산', content: '7월 한 달간 총 12회 모임, 누적 84km! 모두 수고 많으셨습니다.', date: '7/28', author: '크루장 김민준' },
  { id: '3', title: '장마 기간 우천 시 취소 안내', content: '당일 오전 6시 기준 강수량 5mm 이상이면 자동 취소 처리됩니다.', date: '7/20', author: '운영진' },
];

export const crewInfo = { name: '홍대 러닝크루', members: 24, totalKm: 432 };
