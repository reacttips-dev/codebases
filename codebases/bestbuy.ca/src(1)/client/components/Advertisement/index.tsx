export {default as AdLoader} from "./AdLoader";
export {default as AdSlot} from "./AdSlot";
export * from "./AdSlotUtils";

export enum AvailableAdFormats {
    leaderboard = "leaderboard",
    billboard = "billboard",
    offer = "offer",
    featureBanner = "featureBanner",
    mediumRectangle = "mediumRectangle",
    barBanner = "barBanner",
    pencilAd = "pencilAd",
}

export enum AdName {
    superLeaderboard = "super-leaderboard",
    pencilAd = "pencil-ad",
}

export interface AdItem {
    format: AvailableAdFormats;
    id: string;
}
