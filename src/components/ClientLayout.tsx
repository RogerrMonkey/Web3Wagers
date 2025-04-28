"use client"

import { ReactNode } from "react"
import { Web3Provider } from "@/providers/Web3Provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        {children}
        <Toaster />
      </Web3Provider>
    </QueryClientProvider>
  )
} 