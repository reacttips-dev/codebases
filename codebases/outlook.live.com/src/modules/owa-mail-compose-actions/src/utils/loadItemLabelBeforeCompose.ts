import addCLPLabelInfoBar from 'owa-mail-protection/lib/utils/clp/addCLPLabelInfoBar';
import addEncryptionInfobarFromIRMData from 'owa-mail-protection/lib/utils/rms/addEncryptionInfobarFromIRMData';
import { lazyLoadItemCLPInfo } from 'owa-mail-protection';
import { isFeatureEnabled } from 'owa-feature-flags';
import updateCLPViewState from 'owa-mail-protection/lib/actions/clp/updateCLPViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';

export default function loadItemLabelBeforeCompose(viewState: ComposeViewState) {
    if (isFeatureEnabled('cmp-clp') && viewState.referenceItemId?.Id) {
        return lazyLoadItemCLPInfo
            .importAndExecute(viewState.referenceItemId.Id)
            .then(itemCLPInfo => {
                const { clpViewState } = viewState.protectionViewState;

                updateCLPViewState(clpViewState, itemCLPInfo);

                const { selectedCLPLabel } = clpViewState;

                if (!selectedCLPLabel?.isEncryptingLabel) {
                    addEncryptionInfobarFromIRMData(viewState, viewState.protectionViewState);
                }
                addCLPLabelInfoBar(viewState, viewState.protectionViewState);
            });
    }

    return null;
}
