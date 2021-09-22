import type { PremiumPreviewData } from './PremiumPreviewData';

export type SkittleViewStatus = 'Show' | 'Hide';

export enum SkittleCalloutStatus {
    Hide,
    ShowCallout,
    ShowDialog,
}

export interface ProofingViewState {
    /**
     * Editor Bx unique Id
     */
    editorProofingId: string;

    /**
     * How many premium flags were found
     */
    premiumFlagsFound: number;

    /**
     * localized string for premium Categories
     */
    premiumCategories: string;

    /**
     * skittle View Status
     */
    skittleViewStatus: SkittleViewStatus;

    /**
     * skittle Callout Status
     */
    skittleCalloutStatus: SkittleCalloutStatus;

    /**
     * indicates of proofind is disabled
     */
    isProofingDisabled: boolean;

    /**
     * premium preview data
     */
    premiumPreviewData: PremiumPreviewData;

    /**
     * indicate if dex pane is open
     */
    isDexPaneOpen: boolean;
}
