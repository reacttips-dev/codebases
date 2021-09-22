import { action } from 'satcheljs/lib/legacy';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';

export default action('setShouldBlockSelection')(function setShouldBlockSelection(
    viewstate: ReadWriteCommonWellItemViewState,
    shouldBlockSelection: boolean
) {
    viewstate.shouldBlockSelection = shouldBlockSelection;
});
