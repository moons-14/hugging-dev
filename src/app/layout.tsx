import { AppHeader } from '@/components/header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

export const runtime = 'edge';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hugging Dev',
  description: 'We aim to create a tool that makes it easier to take advantage of the APIs provided by Hugging Face',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutComponent>{children}</RootLayoutComponent>
      </body>
    </html>
  )
}

export const RootLayoutComponent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 ">
        {children}
      </div>
      <Toaster />
    </>
  )
}