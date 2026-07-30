import { pgTable, serial, text, integer, boolean, timestamp, real } from 'drizzle-orm/pg-core';

export const meetups = pgTable('meetups', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  pace: text('pace').notNull(),
  capacity: integer('capacity').notNull().default(10),
  registered: integer('registered').notNull().default(0),
  description: text('description').notNull().default(''),
  leader: text('leader').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  meetupId: integer('meetup_id').notNull(),
  name: text('name').notNull(),
  appliedAt: text('applied_at').notNull(),
  attended: boolean('attended').notNull().default(false),
});

export const runRecords = pgTable('run_records', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  distance: real('distance').notNull(),
  duration: text('duration').notNull(),
  avgPace: text('avg_pace').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  author: text('author').notNull(),
  date: text('date').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  likes: integer('likes').notNull().default(0),
  comments: integer('comments').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
