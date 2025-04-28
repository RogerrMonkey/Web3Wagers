"use client"

import { useEffect, useState } from "react"
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import type { MarketInfo } from "@/components/events-list"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyBetsPage() {
  const [userMarkets, setUserMarkets] = useState<MarketInfo[]>([])
  const [loading, setLoading] = useState(true)
  const address = useAddress()
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data: marketCount } = useContractRead(contract, "marketCount")

  useEffect(() => {
    const fetchUserMarkets = async () => {
      if (!contract || !marketCount || !address) return

      setLoading(true)
      const marketsData: MarketInfo[] = []

      for (let i = 0; i < Number(marketCount); i++) {
        try {
          const marketInfo = await contract.call("getMarketInfo", [i])
          const userShares = await contract.call("getSharesBalance", [i, address])

          const hasUserBet = Number(userShares[0]) > 0 || Number(userShares[1]) > 0

          if (hasUserBet) {
            marketsData.push({
              id: i,
              question: marketInfo[0],
              optionA: marketInfo[1],
              optionB: marketInfo[2],
              endTime: Number(marketInfo[3]),
              outcome: Number(marketInfo[4]),
              totalOptionAShares: Number(marketInfo[5]),
              totalOptionBShares: Number(marketInfo[6]),
              resolved: marketInfo[7],
            })
          }
        } catch (error) {
          console.error(`Error fetching market ${i}:`, error)
        }
      }

      setUserMarkets(marketsData)
      setLoading(false)
    }

    if (address) {
      fetchUserMarkets()
    } else {
      setLoading(false)
    }
  }, [contract, marketCount, address])

  const now = Math.floor(Date.now() / 1000)

  const activeMarkets = userMarkets.filter((market) => !market.resolved && now < market.endTime)

  const pendingMarkets = userMarkets.filter((market) => !market.resolved && now >= market.endTime)

  const resolvedMarkets = userMarkets.filter((market) => market.resolved)

  if (!address) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">My Bets</h1>
            <p className="text-muted-foreground">Please connect your wallet to view your bets.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-3xl font-bold">My Bets</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            View all the prediction markets you've participated in.
          </p>

          <div className="w-full max-w-4xl">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active ({activeMarkets.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingMarkets.length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({resolvedMarkets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6 space-y-6">
                {loading ? (
                  <LoadingSkeletons />
                ) : activeMarkets.length > 0 ? (
                  activeMarkets.map((market) => <EventCard key={market.id} market={market} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">You haven't bet on any active markets yet.</p>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6 space-y-6">
                {loading ? (
                  <LoadingSkeletons />
                ) : pendingMarkets.length > 0 ? (
                  pendingMarkets.map((market) => <EventCard key={market.id} market={market} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    You don't have any bets in markets pending resolution.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="resolved" className="mt-6 space-y-6">
                {loading ? (
                  <LoadingSkeletons />
                ) : resolvedMarkets.length > 0 ? (
                  resolvedMarkets.map((market) => <EventCard key={market.id} market={market} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">You don't have any bets in resolved markets.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

function LoadingSkeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex justify-between gap-4">
            <Skeleton className="h-20 w-1/2" />
            <Skeleton className="h-20 w-1/2" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </>
  )
}

