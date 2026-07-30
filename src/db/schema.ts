import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const moim = pgTable('moim', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  time: varchar('time', { length: 5 }).notNull(),
  location: varchar('location', { length: 200 }).notNull(),
  pace: varchar('pace', { length: 10 }).notNull(),
  distance: integer('distance').notNull(),
  capacity: integer('capacity').notNull(),
  joined: integer('joined').default(0).notNull(),
  leaderName: varchar('leader_name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const participant = pgTable('participant', {
  id: serial('id').primaryKey(),
  moimId: integer('moim_id')
    .notNull()
    .references(() => moim.id, { onDelete: 'cascade' }),
  userName: varchar('user_name', { length: 50 }).notNull(),
  attended: boolean('attended').default(false).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const runRecord = pgTable('run_record', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 50 }).default('default-user').notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  distance: real('distance').notNull(),
  duration: integer('duration').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const crewPost = pgTable('crew_post', {
  id: serial('id').primaryKey(),
  author: varchar('author', { length: 50 }).notNull(),
  avatar: varchar('avatar', { length: 5 }).notNull(),
  content: text('content').notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
