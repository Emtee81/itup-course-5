'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createTask, createUser, deleteTask, toggleTask } from '@/db/queries'

export interface FormState {
  error?: string
}

const UserSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name'),
  email: z.email('Enter a valid email'),
})

export async function addUser(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = UserSchema.safeParse(Object.fromEntries(formData))
  if (!input.success) return { error: input.error.issues[0].message }

  const result = await createUser(input.data.name, input.data.email.toLowerCase())
  if (!result.ok) return { error: result.error }

  revalidatePath('/')
  return {}
}

const TaskSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(200),
  userId: z.coerce
    .number({ error: 'Choose a person' })
    .int()
    .positive('Choose a person'),
})

export async function addTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = TaskSchema.safeParse(Object.fromEntries(formData))
  if (!input.success) return { error: input.error.issues[0].message }

  await createTask(input.data)
  revalidatePath('/')
  return {}
}

const IdSchema = z.coerce.number().int().positive()

export async function toggleTaskAction(formData: FormData) {
  const id = IdSchema.safeParse(formData.get('id'))
  if (!id.success) return
  await toggleTask(id.data)
  revalidatePath('/')
}

export async function deleteTaskAction(formData: FormData) {
  const id = IdSchema.safeParse(formData.get('id'))
  if (!id.success) return
  await deleteTask(id.data)
  revalidatePath('/')
}
