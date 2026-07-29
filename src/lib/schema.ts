import { pgTable, text, integer, timestamp, boolean, real } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  neighborhood: text('neighborhood'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const meetings = pgTable('meetings', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  pace: text('pace').notNull(),
  distanceKm: real('distance_km').notNull(),
  dateTime: text('date_time').notNull(),
  maxParticipants: integer('max_participants').notNull().default(10),
  currentParticipants: integer('current_participants').notNull().default(0),
  status: text('status').notNull().default('open'),
  description: text('description'),
  level: text('level').notNull().default('초급'),
  area: text('area').notNull().default('서울'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const meetingParticipants = pgTable('meeting_participants', {
  id: text('id').primaryKey(),
  meetingId: text('meeting_id').notNull(),
  userId: text('user_id').notNull(),
  attended: boolean('attended').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const runningRecords = pgTable('running_records', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  meetingId: text('meeting_id'),
  distanceKm: real('distance_km').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  memo: text('memo'),
  recordedAt: text('recorded_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull(),
  authorName: text('author_name').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Meeting = typeof meetings.$inferSelect
export type MeetingParticipant = typeof meetingParticipants.$inferSelect
export type RunningRecord = typeof runningRecords.$inferSelect
export type Announcement = typeof announcements.$inferSelect
