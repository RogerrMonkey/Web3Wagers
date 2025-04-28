import type React from "react"
import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/ClientLayout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Prediction Market",
  description: "Blockchain-based prediction market using thirdweb and Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

