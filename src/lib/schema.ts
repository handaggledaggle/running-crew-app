import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  numeric,
} from 'drizzle-orm/pg-core';

export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  district: text('district').notNull(),
  pace: text('pace').notNull(),
  paceMin: text('pace_min').notNull(),
  capacity: integer('capacity').notNull().default(10),
  description: text('description').default(''),
  leaderName: text('leader_name').notNull().default('리더'),
  leaderAvatar: text('leader_avatar').notNull().default('LD'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const meetingParticipants = pgTable('meeting_participants', {
  id: serial('id').primaryKey(),
  meetingId: integer('meeting_id').notNull(),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar').notNull().default('?'),
  attended: boolean('attended').default(false),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const runRecords = pgTable('run_records', {
  id: serial('id').primaryKey(),
  userName: text('user_name').notNull().default('나'),
  date: text('date').notNull(),
  distanceKm: numeric('distance_km', { precision: 5, scale: 2 }).notNull(),
  durationMin: integer('duration_min').notNull(),
  pace: text('pace').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
