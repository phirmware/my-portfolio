import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chibuzor Ojukwu — Senior Backend Engineer',
  description:
    'Senior Backend Engineer with 7+ years building distributed, cloud-native systems. Expert in Node.js, TypeScript, Golang & AWS. Now exploring AI/LLM engineering.',
  openGraph: {
    title: 'Chibuzor Ojukwu — Senior Backend Engineer',
    description: 'Portfolio with an AI assistant that answers your questions about my experience.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
