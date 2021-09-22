import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import { getFolderByDistinguishedId } from 'owa-folders';
import setUnseenCount from '../mutators/setUnseenCount';

function onPageVisibilityChanged() {
    if (getSelectedFolder() === getFolderByDistinguishedId('inbox') && !document.hidden) {
        setUnseenCount(0);
    }
}

if (document) {
    document.addEventListener('visibilitychange', onPageVisibilityChanged);
}
