import 'server-only'
import { DrizzleQueryError, asc, eq, not } from 'drizzle-orm'
import { db } from './index'
import { projects, tasks, users, type NewTask } from './schema'

export function listUsers() {
  return db.select().from(users).orderBy(asc(users.name))
}

export function listProjects() {
  return db.query.projects.findMany({
    orderBy: (p, { asc }) => [asc(p.name)],
    with: {
      tasks: {
        orderBy: (t, { asc, desc }) => [asc(t.priority), desc(t.id)],
        with: { user: { columns: { name: true } } },
      },
    },
  })
}

export function listTasksWithoutProject() {
  return db.query.tasks.findMany({
    where: (t, { isNull }) => isNull(t.projectId),
    orderBy: (t, { asc, desc }) => [asc(t.priority), desc(t.id)],
    with: { user: { columns: { name: true } } },
  })
}

export type TaskWithOwner = Awaited<ReturnType<typeof listTasksWithoutProject>>[number]

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

export async function createProject(name: string) {
  try {
    const [project] = await db.insert(projects).values({ name }).returning()
    return { ok: true as const, project }
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false as const, error: 'That project already exists' }
    }
    throw err
  }
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id))
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
