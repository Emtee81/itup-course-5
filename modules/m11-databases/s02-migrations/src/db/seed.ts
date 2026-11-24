import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { projects, tasks, users } from './schema'

loadEnvConfig(process.cwd())

const db = drizzle(process.env.DATABASE_URL!)

async function seed() {
  await db.transaction(async (tx) => {
    await tx.delete(tasks)
    await tx.delete(projects)
    await tx.delete(users)

    const [ana, rui] = await tx
      .insert(users)
      .values([
        { name: 'Ana', email: 'ana@example.com' },
        { name: 'Rui', email: 'rui@example.com' },
      ])
      .returning()

    const [website] = await tx.insert(projects).values({ name: 'Website' }).returning()

    await tx.insert(tasks).values([
      { title: 'Design the home page', userId: ana.id, projectId: website.id, priority: 1 },
      { title: 'Write the about page', userId: rui.id, projectId: website.id },
      { title: 'Book the team lunch', userId: rui.id, priority: 3 },
    ])
  })
  console.log('Seeded 2 people, 1 project and 3 tasks')
}

seed().finally(() => db.$client.end())
