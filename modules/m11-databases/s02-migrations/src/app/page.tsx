import { Suspense } from 'react'
import { connection } from 'next/server'
import ProjectForm from '@/components/ProjectForm'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import UserForm from '@/components/UserForm'
import { listProjects, listTasksWithoutProject, listUsers } from '@/db/queries'
import { deleteProjectAction } from './actions'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Team tasks</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Board />
      </Suspense>
    </main>
  )
}

async function Board() {
  await connection()
  const [users, projects, unassigned] = await Promise.all([
    listUsers(),
    listProjects(),
    listTasksWithoutProject(),
  ])

  return (
    <>
      <section>
        <h2>People ({users.length})</h2>
        <UserForm />
        <ul className={styles.list}>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} <span className={styles.muted}>{u.email}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Projects ({projects.length})</h2>
        <ProjectForm />
        {users.length > 0 ? (
          <TaskForm users={users} projects={projects} />
        ) : (
          <p>Add a person first.</p>
        )}
      </section>

      {projects.map((p) => (
        <section key={p.id} className={styles.project}>
          <h3>
            {p.name} <span className={styles.muted}>({p.tasks.length})</span>
          </h3>
          <TaskList tasks={p.tasks} />
          <form action={deleteProjectAction}>
            <input type="hidden" name="id" value={p.id} />
            <button aria-label={`Delete project ${p.name}`}>Delete project</button>
          </form>
        </section>
      ))}

      <section className={styles.project}>
        <h3>No project <span className={styles.muted}>({unassigned.length})</span></h3>
        <TaskList tasks={unassigned} />
      </section>
    </>
  )
}
