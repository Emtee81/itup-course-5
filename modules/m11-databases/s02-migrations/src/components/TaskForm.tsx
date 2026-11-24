'use client'

import { useActionState } from 'react'
import { addTask, type FormState } from '@/app/actions'
import type { Project, User } from '@/db/schema'
import styles from '@/app/page.module.css'

interface TaskFormProps {
  users: User[]
  projects: Project[]
}

export default function TaskForm({ users, projects }: TaskFormProps) {
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
      <select name="projectId" aria-label="Project" defaultValue="">
        <option value="">No project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select name="priority" aria-label="Priority" defaultValue="2">
        <option value="1">High</option>
        <option value="2">Normal</option>
        <option value="3">Low</option>
      </select>
      <button disabled={pending}>{pending ? 'Adding...' : 'Add task'}</button>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
    </form>
  )
}
