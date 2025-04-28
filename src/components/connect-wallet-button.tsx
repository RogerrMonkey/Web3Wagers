"use client"

// Import just the components we need to avoid the bs58 dependency issue
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import { Button } from "@/components/ui/button"

export function ConnectWalletButton() {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
        <span className="text-sm truncate max-w-[140px]">{address}</span>
      </div>
    )
  }

  return (
    <Button onClick={() => connectWithMetamask()}>
      Connect Wallet
    </Button>
  )
}

