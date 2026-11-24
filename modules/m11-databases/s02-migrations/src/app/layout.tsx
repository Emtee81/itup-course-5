import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team Tasks',
  description: 'M11-E01 - Drizzle setup & first queries',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
