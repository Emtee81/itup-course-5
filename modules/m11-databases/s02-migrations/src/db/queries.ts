import 'server-only'
import { DrizzleQueryError, asc, desc, eq, not } from 'drizzle-orm'
import { db } from './index'
import { tasks, users, type NewTask } from './schema'

export function listUsers() {
  return db.select().from(users).orderBy(asc(users.name))
}

export function listTasks() {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      done: tasks.done,
      owner: users.name,
    })
    .from(tasks)
    .innerJoin(users, eq(tasks.userId, users.id))
    .orderBy(desc(tasks.id))
}

function isUniqueViolation(err: unknown) {
  if (!(err instanceof DrizzleQueryError)) return false
  const cause = err.cause as { code?: string } | undefined
  return cause?.code === '23505'
}

export async function createUser(name: string, email: string) {
  try {
    const [user] = await db.insert(users).values({ name, email }).returning()
    return { ok: true as const, user }
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false as const, error: 'That email is taken' }
    }
    throw err
  }
}

export async function createTask(task: NewTask) {
  const [created] = await db.insert(tasks).values(task).returning()
  return created
}

export async function toggleTask(id: number) {
  await db.update(tasks).set({ done: not(tasks.done) }).where(eq(tasks.id, id))
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id))
}
