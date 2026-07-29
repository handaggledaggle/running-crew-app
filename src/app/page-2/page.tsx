import MeetingDetail, { type MeetingDisplayData } from '@/components/MeetingDetail'
import { getMeetings } from '@/lib/actions/meetings'
import { meetings as mockMeetings } from '@/lib/data'

export default async function Page2() {
  let meeting: MeetingDisplayData

  try {
    const dbMeetings = await getMeetings()
    if (dbMeetings.length > 0) {
      const m = dbMeetings[0]
      meeting = {
        id: m.id,
        title: m.title,
        date: m.dateTime,
        location: m.location,
        pace: m.pace,
        distance: `${m.distanceKm}km`,
        slots: m.maxParticipants,
        joined: m.currentParticipants,
        description: m.description ?? '초급자 환영! 느리게 함께 달려요.',
      }
    } else {
      const m = mockMeetings[0]
      meeting = {
        id: m.id,
        title: m.title,
        date: m.date,
        location: m.location,
        pace: m.pace,
        distance: m.distance,
        slots: m.slots,
        joined: m.joined,
        description: '초급자 환영! 느리게 함께 달려요. 뛰고 나서 편의점 간식 타임 있습니다 🍡',
      }
    }
  } catch {
    const m = mockMeetings[0]
    meeting = {
      id: m.id,
      title: m.title,
      date: m.date,
      location: m.location,
      pace: m.pace,
      distance: m.distance,
      slots: m.slots,
      joined: m.joined,
      description: '초급자 환영! 느리게 함께 달려요. 뛰고 나서 편의점 간식 타임 있습니다 🍡',
    }
  }

  return <MeetingDetail meeting={meeting} />
}
