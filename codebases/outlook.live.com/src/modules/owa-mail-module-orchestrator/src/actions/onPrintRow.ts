import { setShowListPane } from 'owa-mail-layout/lib/actions/setShowListPane';
import { setShowReadingPane } from 'owa-mail-layout/lib/actions/setShowReadingPane';
import { action } from 'satcheljs/lib/legacy';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';

/**
 * Decides whether to hide LP after a print row action in SLV
 */
export default action('onPrintRow')(function onPrintRow() {
    if (isReadingPanePositionOff()) {
        setShowReadingPane(true /* showReadingPane */);
        setShowListPane(false /* showListPane */);
    }
});
