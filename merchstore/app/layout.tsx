import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import ConditionalHeader from "@/components/ui/ConditionalHeader"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Technical Unit Merch Store',
  description: 'A simple online store for Technical Unit merchandise.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
     
      <body className={`${inter.className}`}>
        <ConditionalHeader />
        {children}
        <Toaster/>
      </body>
    </html>
  )
}
