'use client'

import { useActionState } from 'react'
import { addProject, type FormState } from '@/app/actions'
import styles from '@/app/page.module.css'

export default function ProjectForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addProject,
    {},
  )

  return (
    <form action={formAction} className={styles.form}>
      <input name="name" placeholder="Project name" aria-label="Project name" />
      <button disabled={pending}>{pending ? 'Adding...' : 'Add project'}</button>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
    </form>
  )
}
