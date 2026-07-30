import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  boolean,
  real,
} from 'drizzle-orm/pg-core';

export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  time: varchar('time', { length: 5 }).notNull(),
  location: varchar('location', { length: 200 }).notNull(),
  district: varchar('district', { length: 20 }).notNull(),
  pace: varchar('pace', { length: 20 }).notNull(),
  capacity: integer('capacity').notNull(),
  leader: varchar('leader', { length: 50 }).notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  meetingId: integer('meeting_id')
    .references(() => meetings.id, { onDelete: 'cascade' })
    .notNull(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  userAvatar: varchar('user_avatar', { length: 10 }).notNull().default('user'),
  attended: boolean('attended'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const runningRecords = pgTable('running_records', {
  id: serial('id').primaryKey(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  distanceKm: real('distance_km').notNull(),
  durationMin: integer('duration_min').notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  author: varchar('author', { length: 50 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  avatar: varchar('avatar', { length: 10 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const noticeLikes = pgTable('notice_likes', {
  id: serial('id').primaryKey(),
  noticeId: integer('notice_id')
    .references(() => notices.id, { onDelete: 'cascade' })
    .notNull(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const noticeComments = pgTable('notice_comments', {
  id: serial('id').primaryKey(),
  noticeId: integer('notice_id')
    .references(() => notices.id, { onDelete: 'cascade' })
    .notNull(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
