import { Header } from "@/components/header"
import { EventsList } from "@/components/events-list"

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-3xl font-bold">All Prediction Markets</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            Browse all available prediction markets and place your bets using Sepolia ETH.
          </p>
          <EventsList />
        </div>
      </div>
    </main>
  )
}

