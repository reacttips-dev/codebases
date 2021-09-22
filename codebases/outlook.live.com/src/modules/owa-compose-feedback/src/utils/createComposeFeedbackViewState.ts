import type ComposeFeedbackViewState from '../store/schema/ComposeFeedbackViewState';

export default function createComposeFeedbackViewState(): ComposeFeedbackViewState {
    return {
        shouldShowFeedbackRibbon: false,
        isFeedbackProvided: false,
        feedbackRibbonDetails: {
            ribbonMessage: undefined,
            subFeature: undefined,
            thankYouMessage: undefined,
            noFeedbackDialogParams: undefined,
        },
    };
}
