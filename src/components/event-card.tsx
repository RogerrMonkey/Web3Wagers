"use client"

import { useState } from "react"
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import type { MarketInfo } from "@/components/events-list"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { formatEther, parseEther } from "ethers/lib/utils"
import { CheckCircle, Clock, AlertTriangle, Award } from "lucide-react"

export function EventCard({ market }: { market: MarketInfo }) {
  const [betAmount, setBetAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const address = useAddress()
  const { contract } = useContract(CONTRACT_ADDRESS)

  const { data: userShares, refetch: refetchShares } = useContractRead(contract, "getSharesBalance", [
    market.id,
    address || ethers.constants.AddressZero,
  ])

  const now = Math.floor(Date.now() / 1000)
  const isActive = !market.resolved && now < market.endTime
  const isPending = !market.resolved && now >= market.endTime
  const isResolved = market.resolved

  const totalPool = Number(market.totalOptionAShares) + Number(market.totalOptionBShares)
  const optionAPercentage = totalPool > 0 ? (Number(market.totalOptionAShares) / totalPool) * 100 : 50
  const optionBPercentage = totalPool > 0 ? (Number(market.totalOptionBShares) / totalPool) * 100 : 50

  const formatTimeLeft = () => {
    if (now >= market.endTime) return "Ended"

    const secondsLeft = market.endTime - now
    const days = Math.floor(secondsLeft / 86400)
    const hours = Math.floor((secondsLeft % 86400) / 3600)
    const minutes = Math.floor((secondsLeft % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const placeBet = async (isOptionA: boolean) => {
    if (!address || !contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!betAmount || Number.parseFloat(betAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const tx = await contract.call("buyShares", [market.id, isOptionA], { value: parseEther(betAmount) })

      toast({
        title: "Success",
        description: `You bet ${betAmount} ETH on ${isOptionA ? market.optionA : market.optionB}`,
      })

      setBetAmount("")
      refetchShares()
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Error",
        description: "Failed to place bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const claimWinnings = async () => {
    if (!address || !contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const tx = await contract.call("claimWinnings", [market.id])

      toast({
        title: "Success",
        description: "You have successfully claimed your winnings!",
      })

      refetchShares()
    } catch (error) {
      console.error("Error claiming winnings:", error)
      toast({
        title: "Error",
        description: "Failed to claim winnings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStatus = () => {
    if (isActive) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Active • {formatTimeLeft()}</span>
        </Badge>
      )
    } else if (isPending) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="h-3 w-3" />
          <span>Pending Resolution</span>
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3" />
          <span>Resolved</span>
        </Badge>
      )
    }
  }

  const renderOutcome = () => {
    if (!isResolved) return null

    const winningOption = market.outcome === 1 ? market.optionA : market.optionB

    return (
      <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
        <Award className="h-5 w-5" />
        <span>
          Outcome: <strong>{winningOption}</strong>
        </span>
      </div>
    )
  }

  const userOptionAShares = userShares ? Number(userShares[0]) : 0
  const userOptionBShares = userShares ? Number(userShares[1]) : 0
  const hasUserBet = userOptionAShares > 0 || userOptionBShares > 0

  const canClaim =
    isResolved &&
    hasUserBet &&
    ((market.outcome === 1 && userOptionAShares > 0) || (market.outcome === 2 && userOptionBShares > 0))

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{market.question}</CardTitle>
            <CardDescription className="mt-2">Total Pool: {formatEther(totalPool.toString())} ETH</CardDescription>
          </div>
          {renderStatus()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${market.outcome === 1 ? "bg-green-50 border-green-200" : ""}`}>
            <div className="font-medium mb-2">{market.optionA}</div>
            <div className="text-sm text-muted-foreground mb-2">
              {formatEther(market.totalOptionAShares.toString())} ETH ({optionAPercentage.toFixed(1)}%)
            </div>
            {userOptionAShares > 0 && (
              <Badge variant="secondary" className="mt-1">
                Your bet: {formatEther(userOptionAShares.toString())} ETH
              </Badge>
            )}
          </div>
          <div className={`p-4 rounded-lg border ${market.outcome === 2 ? "bg-green-50 border-green-200" : ""}`}>
            <div className="font-medium mb-2">{market.optionB}</div>
            <div className="text-sm text-muted-foreground mb-2">
              {formatEther(market.totalOptionBShares.toString())} ETH ({optionBPercentage.toFixed(1)}%)
            </div>
            {userOptionBShares > 0 && (
              <Badge variant="secondary" className="mt-1">
                Your bet: {formatEther(userOptionBShares.toString())} ETH
              </Badge>
            )}
          </div>
        </div>

        {renderOutcome()}

        {isActive && address && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Amount in ETH"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="0.001"
                step="0.001"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => placeBet(true)} disabled={isSubmitting} variant="outline">
                Bet on {market.optionA}
              </Button>
              <Button onClick={() => placeBet(false)} disabled={isSubmitting} variant="outline">
                Bet on {market.optionB}
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {canClaim && (
        <CardFooter>
          <Button className="w-full" onClick={claimWinnings} disabled={isSubmitting}>
            <Award className="mr-2 h-4 w-4" />
            Claim Winnings
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

