export interface MarketplaceSellerActionTypes {
    type: string;
}

export const MarketplaceSellerActionTypes = {
    MarketplaceSellerSignUpPageLoad: "MARKETPLACE_SELLER_SIGN_UP_PAGE_LOAD",
};

export interface MarketplaceActionCreator {
    [key: string]: MarketplaceSellerActionTypes;
}

export const marketplaceActionCreator = {
    marketplaceSellerSignUpPageLoad: { type: MarketplaceSellerActionTypes.MarketplaceSellerSignUpPageLoad },
};
