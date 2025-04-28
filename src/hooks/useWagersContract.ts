import { useContract, useContractRead, useContractWrite, useAddress } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS, OWNER_ADDRESS } from "@/lib/constants";
import { BuySharesParams, CreateMarketParams, Market, MarketOutcome, SharesBalance } from "@/types/contracts";
import { ethers } from "ethers";

export const useWagersContract = () => {
    const { contract } = useContract(CONTRACT_ADDRESS);
    const address = useAddress();
    const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

    // Read functions
    const { data: marketCount, isLoading: isLoadingMarketCount } = useContractRead(
        contract,
        "marketCount"
    );

    const getMarketInfo = async (marketId: number) => {
        try {
            const data = await contract?.call("getMarketInfo", [marketId]);
            if (!data) return null;

            return {
                question: data[0],
                optionA: data[1],
                optionB: data[2],
                endTime: data[3].toNumber(),
                outcome: data[4],
                totalOptionAShares: ethers.utils.formatEther(data[5]),
                totalOptionBShares: ethers.utils.formatEther(data[6]),
                resolved: data[7],
            } as Market;
        } catch (error) {
            console.error("Error fetching market info:", error);
            return null;
        }
    };

    const getSharesBalance = async (marketId: number, userAddress: string): Promise<SharesBalance | null> => {
        try {
            const data = await contract?.call("getSharesBalance", [marketId, userAddress]);
            if (!data) return null;

            return {
                optionAShares: ethers.utils.formatEther(data[0]),
                optionBShares: ethers.utils.formatEther(data[1]),
            };
        } catch (error) {
            console.error("Error fetching shares balance:", error);
            return null;
        }
    };

    // Write functions
    const { mutateAsync: createMarket } = useContractWrite(contract, "createMarket");
    const { mutateAsync: buyShares } = useContractWrite(contract, "buyShares");
    const { mutateAsync: resolveMarket } = useContractWrite(contract, "resolveMarket");
    const { mutateAsync: claimWinnings } = useContractWrite(contract, "claimWinnings");

    const handleCreateMarket = async (params: CreateMarketParams) => {
        if (!isOwner) throw new Error("Only owner can create markets");
        
        try {
            const data = await createMarket({
                args: [params.question, params.optionA, params.optionB, params.duration],
            });
            return data;
        } catch (error) {
            console.error("Error creating market:", error);
            throw error;
        }
    };

    const handleBuyShares = async (params: BuySharesParams) => {
        try {
            const data = await buyShares({
                args: [params.marketId, params.isOptionA],
                overrides: {
                    value: ethers.utils.parseEther(params.amount),
                },
            });
            return data;
        } catch (error) {
            console.error("Error buying shares:", error);
            throw error;
        }
    };

    const handleResolveMarket = async (marketId: number, outcome: MarketOutcome) => {
        if (!isOwner) throw new Error("Only owner can resolve markets");
        
        try {
            const data = await resolveMarket({
                args: [marketId, outcome],
            });
            return data;
        } catch (error) {
            console.error("Error resolving market:", error);
            throw error;
        }
    };

    const handleClaimWinnings = async (marketId: number) => {
        try {
            const data = await claimWinnings({
                args: [marketId],
            });
            return data;
        } catch (error) {
            console.error("Error claiming winnings:", error);
            throw error;
        }
    };

    return {
        contract,
        isOwner,
        marketCount: marketCount ? marketCount.toNumber() : 0,
        isLoadingMarketCount,
        getMarketInfo,
        getSharesBalance,
        createMarket: handleCreateMarket,
        buyShares: handleBuyShares,
        resolveMarket: handleResolveMarket,
        claimWinnings: handleClaimWinnings,
    };
}; 