export enum MarketOutcome {
    UNRESOLVED = 0,
    OPTION_A = 1,
    OPTION_B = 2
}

export interface Market {
    question: string;
    optionA: string;
    optionB: string;
    endTime: number;
    outcome: MarketOutcome;
    totalOptionAShares: string; // Using string for big numbers
    totalOptionBShares: string;
    resolved: boolean;
}

export interface MarketWithId extends Market {
    id: number;
}

export interface SharesBalance {
    optionAShares: string;
    optionBShares: string;
}

export interface CreateMarketParams {
    question: string;
    optionA: string;
    optionB: string;
    duration: number;
}

export interface BuySharesParams {
    marketId: number;
    isOptionA: boolean;
    amount: string;
} 