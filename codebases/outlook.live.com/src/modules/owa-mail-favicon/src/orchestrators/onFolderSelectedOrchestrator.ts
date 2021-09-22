import { orchestrator } from 'satcheljs';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import { getFolderByDistinguishedId } from 'owa-folders';
import setUnseenCount from '../mutators/setUnseenCount';

orchestrator(onSelectFolderComplete, actionMessage => {
    if (getSelectedFolder() === getFolderByDistinguishedId('inbox')) {
        // clear the unseen count
        setUnseenCount(0);
    }
});
