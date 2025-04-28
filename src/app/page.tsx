import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { EventsList } from "@/components/events-list"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-4xl font-bold text-center">Blockchain Prediction Market</h1>
          <p className="text-xl text-center max-w-2xl text-muted-foreground">
            Bet on future events with Sepolia ETH and win rewards if your prediction is correct.
          </p>
          <ConnectWalletButton />
          <EventsList />
        </div>
      </div>
    </main>
  )
}

