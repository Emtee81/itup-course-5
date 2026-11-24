'use client'

import { useActionState } from 'react'
import { addUser, type FormState } from '@/app/actions'
import styles from '@/app/page.module.css'

export default function UserForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(addUser, {})

  return (
    <form action={formAction} className={styles.form}>
      <input name="name" placeholder="Name" aria-label="Name" />
      <input name="email" placeholder="Email" aria-label="Email" />
      <button disabled={pending}>{pending ? 'Adding...' : 'Add person'}</button>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
    </form>
  )
}
