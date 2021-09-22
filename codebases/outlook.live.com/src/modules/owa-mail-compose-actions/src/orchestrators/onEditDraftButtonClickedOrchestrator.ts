import { CannotEditDraftForSMIMEDialogText } from './onEditDraftButtonClickedOrchestrator.locstring.json';
import loc from 'owa-localize';
import onEditDraftButtonClicked from '../actions/onEditDraftButtonClicked';
import { confirm } from 'owa-confirm-dialog';
import { mailStore } from 'owa-mail-store';
import { lazySmimeAdapter } from 'owa-smime-adapter';
import isSmimeAdapterUsable from 'owa-smime-adapter/lib/utils/isSmimeAdapterUsable';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { orchestrator } from 'satcheljs';
import loadDraftToCompose from '../actions/loadDraftToCompose';

orchestrator(onEditDraftButtonClicked, async actionMessage => {
    const { itemId, sxsId } = actionMessage;
    const cachedItem = mailStore.items.get(itemId);

    if (isSMIMEItem(cachedItem)) {
        await lazySmimeAdapter.import();

        if (!isSmimeAdapterUsable()) {
            // Don't allow editing if an item is S/MIME and adapter is not usable
            confirm(
                null /* title */,
                loc(CannotEditDraftForSMIMEDialogText),
                false /* resolveImmediately */,
                {
                    hideCancelButton: true,
                }
            );

            return;
        }
    }

    loadDraftToCompose(itemId, sxsId);
});
