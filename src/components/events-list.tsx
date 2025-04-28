"use client"

import { useEffect, useState } from "react"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { EventCard } from "@/components/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CONTRACT_ADDRESS } from "@/lib/constants"

export type MarketInfo = {
  id: number
  question: string
  optionA: string
  optionB: string
  endTime: number
  outcome: number
  totalOptionAShares: number
  totalOptionBShares: number
  resolved: boolean
}

export function EventsList() {
  const [markets, setMarkets] = useState<MarketInfo[]>([])
  const [loading, setLoading] = useState(true)
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data: marketCount } = useContractRead(contract, "marketCount")

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!contract || !marketCount) return

      setLoading(true)
      const marketsData: MarketInfo[] = []

      for (let i = 0; i < Number(marketCount); i++) {
        try {
          const data = await contract.call("getMarketInfo", [i])
          marketsData.push({
            id: i,
            question: data[0],
            optionA: data[1],
            optionB: data[2],
            endTime: Number(data[3]),
            outcome: Number(data[4]),
            totalOptionAShares: Number(data[5]),
            totalOptionBShares: Number(data[6]),
            resolved: data[7],
          })
        } catch (error) {
          console.error(`Error fetching market ${i}:`, error)
        }
      }

      setMarkets(marketsData)
      setLoading(false)
    }

    fetchMarkets()
  }, [contract, marketCount])

  const activeMarkets = markets.filter((market) => !market.resolved && Date.now() / 1000 < market.endTime)

  const pendingMarkets = markets.filter((market) => !market.resolved && Date.now() / 1000 >= market.endTime)

  const resolvedMarkets = markets.filter((market) => market.resolved)

  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeMarkets.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Resolution ({pendingMarkets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedMarkets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-6">
          {loading ? (
            <LoadingSkeletons />
          ) : activeMarkets.length > 0 ? (
            activeMarkets.map((market) => <EventCard key={market.id} market={market} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">No active prediction markets available.</p>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6 space-y-6">
          {loading ? (
            <LoadingSkeletons />
          ) : pendingMarkets.length > 0 ? (
            pendingMarkets.map((market) => <EventCard key={market.id} market={market} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">No markets pending resolution.</p>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-6">
          {loading ? (
            <LoadingSkeletons />
          ) : resolvedMarkets.length > 0 ? (
            resolvedMarkets.map((market) => <EventCard key={market.id} market={market} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">No resolved markets yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
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

