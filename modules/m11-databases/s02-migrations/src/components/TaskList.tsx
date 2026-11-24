import { deleteTaskAction, toggleTaskAction } from '@/app/actions'
import type { TaskWithOwner } from '@/db/queries'
import styles from '@/app/page.module.css'

const PRIORITY = { 1: 'High', 2: 'Normal', 3: 'Low' } as Record<number, string>

export default function TaskList({ tasks }: { tasks: TaskWithOwner[] }) {
  if (tasks.length === 0) return <p className={styles.muted}>No tasks.</p>

  return (
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
          <span className={styles.muted}>
            {t.user.name} - {PRIORITY[t.priority]}
          </span>
          <form action={deleteTaskAction}>
            <input type="hidden" name="id" value={t.id} />
            <button aria-label={`Delete ${t.title}`}>Delete</button>
          </form>
        </li>
      ))}
    </ul>
  )
}
