import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('closePrintPanel')(function closePrintPanel(
    viewState: ItemReadingPaneViewState
) {
    viewState.isPrint = false;
});
