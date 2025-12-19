import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MONTAUK COMMAND | Incident Management System',
  description: 'Classified. Authorized Personnel Only.',
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
