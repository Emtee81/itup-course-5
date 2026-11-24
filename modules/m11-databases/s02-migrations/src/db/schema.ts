import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
})

export const projects = pgTable('projects', {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
})

export const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  title: text().notNull(),
  done: boolean().notNull().default(false),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  priority: integer().notNull().default(2),
  projectId: integer('project_id').references(() => projects.id, {
    onDelete: 'set null',
  }),
})

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}))

export type User = typeof users.$inferSelect
export type Project = typeof projects.$inferSelect
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
