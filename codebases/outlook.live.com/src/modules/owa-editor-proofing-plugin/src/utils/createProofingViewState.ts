import { ProofingViewState, SkittleCalloutStatus } from '../store/schema/ProofingViewState';
import { getGuid } from 'owa-guid';
import { PremiumPreviewType, PremiumPreviewStatus } from '../store/schema/PremiumPreviewData';
import { PREMIUM_SUGGESTIONS_NEW_COUNT } from '../constants';

export default function createProofingViewState(): ProofingViewState {
    return {
        editorProofingId: getGuid(),
        premiumFlagsFound: 0,
        premiumCategories: '',
        skittleViewStatus: 'Hide',
        isProofingDisabled: false,
        skittleCalloutStatus: SkittleCalloutStatus.Hide,
        premiumPreviewData: {
            numberOfDaysLeftToUsePremiunSuggestions: undefined,
            premiumSuggestionsCount: PREMIUM_SUGGESTIONS_NEW_COUNT,
            premiumPreviewStatus: PremiumPreviewStatus.Unknown,
            premiumPreviewType: PremiumPreviewType.None,
            premiumPreviewSource: 'none',
        },
        isDexPaneOpen: false,
    };
}
