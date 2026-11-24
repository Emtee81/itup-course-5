import { Suspense } from 'react'
import { connection } from 'next/server'
import TaskForm from '@/components/TaskForm'
import UserForm from '@/components/UserForm'
import { listTasks, listUsers } from '@/db/queries'
import { deleteTaskAction, toggleTaskAction } from './actions'
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
  const [users, tasks] = await Promise.all([listUsers(), listTasks()])

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
        <h2>Tasks ({tasks.length})</h2>
        {users.length > 0 ? <TaskForm users={users} /> : <p>Add a person first.</p>}
        <ul className={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} className={t.done ? styles.done : undefined}>
              <form action={toggleTaskAction}>
                <input type="hidden" name="id" value={t.id} />
                <button aria-label={`Toggle ${t.title}`}>
                  {t.done ? 'Undo' : 'Done'}
                </button>
              </form>
              <span>{t.title}</span>
              <span className={styles.muted}>{t.owner}</span>
              <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={t.id} />
                <button aria-label={`Delete ${t.title}`}>Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
