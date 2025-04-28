"use client"

import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useAddress } from "@thirdweb-dev/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BarChart2, Award } from "lucide-react"

export function Header() {
  const address = useAddress()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            PredictMarket
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/markets">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Markets
                </Link>
              </Button>
              {address && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-bets">
                    <Award className="mr-2 h-4 w-4" />
                    My Bets
                  </Link>
                </Button>
              )}
            </nav>
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}

