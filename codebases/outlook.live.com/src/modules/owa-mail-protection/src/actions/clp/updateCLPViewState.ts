import { mutatorAction } from 'satcheljs';
import getDefaultCLPLabel from '../../utils/clp/getDefaultCLPLabel';
import type ItemCLPInfo from 'owa-mail-store/lib/store/schema/ItemCLPInfo';
import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';

export default mutatorAction(
    'updateCLPViewState',
    (clpViewState: CLPViewState, itemCLPInfo: ItemCLPInfo) => {
        if (clpViewState && itemCLPInfo) {
            const { selectedLabel, nonTenantLabelString } = itemCLPInfo;
            if (selectedLabel) {
                clpViewState.selectedCLPLabel = selectedLabel;
                clpViewState.originalCLPLabel = selectedLabel;
            }
            if (!clpViewState.selectedCLPLabel) {
                clpViewState.selectedCLPLabel = getDefaultCLPLabel();
            }
            clpViewState.nonTenantLabelString = nonTenantLabelString;
        }
    }
);
