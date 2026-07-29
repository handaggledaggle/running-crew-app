import MeetingList, { type MeetingDisplay } from '@/components/MeetingList'
import { getMeetings } from '@/lib/actions/meetings'
import { meetings as mockMeetings } from '@/lib/data'

export default async function Page1() {
  let displayMeetings: MeetingDisplay[]

  try {
    const dbMeetings = await getMeetings()
    if (dbMeetings.length > 0) {
      displayMeetings = dbMeetings.map(m => ({
        id: m.id,
        title: m.title,
        date: m.dateTime,
        location: m.location,
        pace: m.pace,
        slots: m.maxParticipants,
        joined: m.currentParticipants,
        distance: `${m.distanceKm}km`,
        tags: [m.level, m.area],
      }))
    } else {
      displayMeetings = mockMeetings
    }
  } catch {
    displayMeetings = mockMeetings
  }

  return <MeetingList initialMeetings={displayMeetings} />
}
