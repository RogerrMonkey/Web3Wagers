"use client"

import type React from "react"

import { useState } from "react"
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { EventsList, type MarketInfo } from "@/components/events-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminPage() {
  const [question, setQuestion] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionB, setOptionB] = useState("")
  const [duration, setDuration] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)

  const { toast } = useToast()
  const address = useAddress()
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data: marketCount } = useContractRead(contract, "marketCount")

  const [pendingMarkets, setPendingMarkets] = useState<MarketInfo[]>([])
  const [loading, setLoading] = useState(true)

  const isOwner = true // In a real app, you would check if the address is the contract owner

  const createMarket = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address || !contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!question || !optionA || !optionB || !duration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const durationInSeconds = Number.parseInt(duration) * 24 * 60 * 60 // Convert days to seconds

    try {
      setIsSubmitting(true)
      const tx = await contract.call("createMarket", [question, optionA, optionB, durationInSeconds])

      toast({
        title: "Success",
        description: "Prediction market created successfully!",
      })

      // Reset form
      setQuestion("")
      setOptionA("")
      setOptionB("")
      setDuration("")
    } catch (error) {
      console.error("Error creating market:", error)
      toast({
        title: "Error",
        description: "Failed to create prediction market. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resolveMarket = async () => {
    if (!address || !contract || !selectedMarket || !selectedOutcome) {
      toast({
        title: "Error",
        description: "Please select a market and outcome",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const outcome = selectedOutcome === "optionA" ? 1 : 2
      const tx = await contract.call("resolveMarket", [Number.parseInt(selectedMarket), outcome])

      toast({
        title: "Success",
        description: "Market resolved successfully!",
      })

      // Reset selection
      setSelectedMarket(null)
      setSelectedOutcome(null)
    } catch (error) {
      console.error("Error resolving market:", error)
      toast({
        title: "Error",
        description: "Failed to resolve market. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!address) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Please connect your wallet to access the admin dashboard.</p>
          </div>
        </div>
      </main>
    )
  }

  if (!isOwner) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>Only the contract owner can access the admin dashboard.</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <Card>
            <CardHeader>
              <CardTitle>Create New Prediction Market</CardTitle>
              <CardDescription>Create a new prediction market for users to bet on.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createMarket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="E.g., Will AI take over software development completely?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optionA">Option A</Label>
                    <Input
                      id="optionA"
                      placeholder="E.g., Yes"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optionB">Option B</Label>
                    <Input
                      id="optionB"
                      placeholder="E.g., No"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="E.g., 7"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Create Prediction Market
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolve Prediction Market</CardTitle>
              <CardDescription>Resolve a prediction market that has ended.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="market">Select Market</Label>
                <Select value={selectedMarket || ""} onValueChange={setSelectedMarket}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a market to resolve" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingMarkets.map((market) => (
                      <SelectItem key={market.id} value={market.id.toString()}>
                        {market.question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMarket && (
                <div className="space-y-2">
                  <Label htmlFor="outcome">Select Outcome</Label>
                  <Select value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the winning option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optionA">
                        {pendingMarkets.find((m) => m.id.toString() === selectedMarket)?.optionA}
                      </SelectItem>
                      <SelectItem value="optionB">
                        {pendingMarkets.find((m) => m.id.toString() === selectedMarket)?.optionB}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={resolveMarket}
                disabled={!selectedMarket || !selectedOutcome || isSubmitting}
                className="w-full"
              >
                Resolve Market
              </Button>
            </CardFooter>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Prediction Markets</h2>
            <EventsList />
          </div>
        </div>
      </div>
    </main>
  )
}

