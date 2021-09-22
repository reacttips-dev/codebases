import type SmartReplyComposeSIGSData from 'owa-mail-smart-pill-features-types/lib/schema/SmartReplyComposeSIGSData';
import { SmartDocOption } from 'owa-mail-smart-pill-features-types/lib/schema/SmartDocOption';
import type SmartPillViewState from 'owa-mail-smart-pill-features-types/lib/schema/SmartPillViewState';

export default function createSmartPillViewState(
    smartDocOption: SmartDocOption
): SmartPillViewState {
    const smartReplyComposeSIGSData: SmartReplyComposeSIGSData = {
        isSmartSuggestionsClicked: false,
        suggestionsClickedTime: null,
        clickIndex: -1,
    };
    return {
        smartReplyComposeSIGSData: smartReplyComposeSIGSData,
        smartDocOption: smartDocOption || SmartDocOption.None,
    };
}
