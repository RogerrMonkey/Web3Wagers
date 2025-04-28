"use client"

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { ReactNode } from "react";

interface Web3ProviderProps {
    children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
    return (
        <ThirdwebProvider
            activeChain={Sepolia}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
            supportedChains={[Sepolia]}
            dAppMeta={{
                name: "Web3 Prediction Market",
                description: "Blockchain-based prediction market",
                logoUrl: "",
                url: "",
            }}
        >
            {children}
        </ThirdwebProvider>
    );
} 