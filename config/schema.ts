import { integer, pgTable, varchar, timestamp, json} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer().notNull().default(5)
});

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId:varchar(),
  createdBy:varchar().references(() => usersTable.email),
  createAt:timestamp().defaultNow()
});

export const framesTable = pgTable("frames", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  frameId:varchar(),
  projectId:varchar().references(() => projectsTable.projectId),
  createdAt:timestamp().defaultNow()
});

export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatMessage:json(),
  projectId:varchar().references(() => projectsTable.projectId),
  createdAt:timestamp().defaultNow()
});
