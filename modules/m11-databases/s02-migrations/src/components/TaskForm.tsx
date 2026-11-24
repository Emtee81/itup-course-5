'use client'

import { useActionState } from 'react'
import { addTask, type FormState } from '@/app/actions'
import type { User } from '@/db/schema'
import styles from '@/app/page.module.css'

export default function TaskForm({ users }: { users: User[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(addTask, {})

  return (
    <form action={formAction} className={styles.form}>
      <input name="title" placeholder="New task" aria-label="Task title" />
      <select name="userId" aria-label="Assigned to" defaultValue="">
        <option value="" disabled>Assign to...</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <button disabled={pending}>{pending ? 'Adding...' : 'Add task'}</button>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
    </form>
  )
}
