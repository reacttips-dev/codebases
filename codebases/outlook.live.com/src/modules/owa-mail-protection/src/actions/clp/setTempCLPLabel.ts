import { mutatorAction } from 'satcheljs';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';

export default mutatorAction(
    'setTempCLPLabel',
    (clpViewState: CLPViewState, labelToSet: CLPLabel) => {
        clpViewState.tempCLPLabel = labelToSet;
    }
);
