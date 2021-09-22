import { action } from 'satcheljs/lib/legacy';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';

export default action('setContextMenuVisibility')(function setContextMenuVisibility(
    viewstate: ReadWriteCommonWellItemViewState,
    isContextMenuShown: boolean
) {
    viewstate.isContextMenuOpen = isContextMenuShown;
});
