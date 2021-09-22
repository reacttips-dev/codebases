import { action } from 'satcheljs/lib/legacy';
import type ReadWriteCommonWellItemViewState from '../store/schema/ReadWriteCommonWellItemViewState';

export default action('setCommonWellItemSelectedState')(function setCommonWellItemSelectedState(
    viewstate: ReadWriteCommonWellItemViewState,
    isSelected: boolean
) {
    viewstate.isSelected = isSelected;
});
