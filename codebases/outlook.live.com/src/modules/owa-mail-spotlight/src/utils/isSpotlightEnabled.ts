import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function isSpotlightEnabled(): boolean {
    return (
        isFeatureEnabled('tri-spotlight2') &&
        getUserConfiguration().UserOptions?.MessageHighlightsEnabled &&
        !getIsBitSet(ListViewBitFlagsMasks.SpotlightDisabled)
    );
}
