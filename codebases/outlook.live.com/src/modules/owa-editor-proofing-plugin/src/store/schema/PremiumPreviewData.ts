export enum PremiumPreviewType {
    TimeBased,
    CountBased,
    TimeAndCountCombined,
    BasicSkittle,
    None,
}

export enum PremiumPreviewStatus {
    New,
    Activated,
    Expired,
    Unknown,
}

export type PremiumPreviewSource = 'settings' | 'skittle' | 'contextualCard' | 'none';

export interface PremiumPreviewData {
    /**
     * indicates how many days left for the premium preview
     */
    numberOfDaysLeftToUsePremiunSuggestions: number;
    /**
     * indicates how many more suggestions left for the premium preview
     */
    premiumSuggestionsCount: number;
    /**
     * premium Preview Status
     */
    premiumPreviewStatus: PremiumPreviewStatus;
    /**
     * premium Preview Type
     */
    premiumPreviewType: PremiumPreviewType;

    /**
     * The source where user open premium Preview
     */
    premiumPreviewSource: PremiumPreviewSource;
}
