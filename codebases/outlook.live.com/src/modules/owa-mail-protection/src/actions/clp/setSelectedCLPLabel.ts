import { action } from 'satcheljs';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';

export default action(
    'setSelectedCLPLabel',
    (labelToSet: CLPLabel, infoBarViewState: InfoBarHostViewState, clpViewState: CLPViewState) => ({
        labelToSet,
        infoBarViewState,
        clpViewState,
    })
);
