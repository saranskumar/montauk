import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAWKINS COMMAND | Incident Management System',
  description: 'Track strange events, threats, and Upside Down activity in Hawkins',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
