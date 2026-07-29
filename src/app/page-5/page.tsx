import AnnouncementFeed, { type NoticeDisplay } from '@/components/AnnouncementFeed'
import { getAnnouncements } from '@/lib/actions/announcements'
import { notices as mockNotices, crewInfo } from '@/lib/data'

export default async function Page5() {
  let displayNotices: NoticeDisplay[]

  try {
    const dbNotices = await getAnnouncements()
    if (dbNotices.length > 0) {
      displayNotices = dbNotices.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        date: n.createdAt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
        author: n.authorName,
      }))
    } else {
      displayNotices = mockNotices.map(n => ({ id: n.id, title: n.title, content: n.content, date: n.date, author: n.author }))
    }
  } catch {
    displayNotices = mockNotices.map(n => ({ id: n.id, title: n.title, content: n.content, date: n.date, author: n.author }))
  }

  return (
    <AnnouncementFeed
      initialNotices={displayNotices}
      crewName={crewInfo.name}
      memberCount={crewInfo.members}
      totalKm={crewInfo.totalKm}
    />
  )
}
