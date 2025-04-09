import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
// import { AuthProvider } from '../context/AuthContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Periskope',
  description: 'Built by Tanmay Jain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}