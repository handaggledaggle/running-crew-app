import AttendancePanel, { type AttendeeDisplay } from '@/components/AttendancePanel'
import { getAttendees } from '@/lib/actions/participants'
import { getMeetings } from '@/lib/actions/meetings'
import { attendees as mockAttendees, meetings as mockMeetings } from '@/lib/data'

export default async function Page3() {
  let meetingTitle = mockMeetings[0].title
  let meetingDate = mockMeetings[0].date
  let displayAttendees: AttendeeDisplay[]

  try {
    const dbMeetings = await getMeetings()
    const meetingId = dbMeetings[0]?.id ?? ''

    if (meetingId) {
      meetingTitle = dbMeetings[0].title
      meetingDate = dbMeetings[0].dateTime
      const rows = await getAttendees(meetingId)
      if (rows.length > 0) {
        displayAttendees = rows.map((r, i) => ({
          id: r.id,
          name: `참가자 ${i + 1}`,
          avatar: '🏃',
          attended: r.attended,
        }))
      } else {
        displayAttendees = mockAttendees.map(a => ({ id: a.id, name: a.name, avatar: a.avatar, attended: a.checked }))
      }
    } else {
      displayAttendees = mockAttendees.map(a => ({ id: a.id, name: a.name, avatar: a.avatar, attended: a.checked }))
    }
  } catch {
    displayAttendees = mockAttendees.map(a => ({ id: a.id, name: a.name, avatar: a.avatar, attended: a.checked }))
  }

  return (
    <AttendancePanel
      meetingTitle={meetingTitle}
      meetingDate={meetingDate}
      initialAttendees={displayAttendees}
    />
  )
}
