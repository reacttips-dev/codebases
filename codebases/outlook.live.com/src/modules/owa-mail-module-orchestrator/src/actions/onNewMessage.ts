import { setShowListPane } from 'owa-mail-layout/lib/actions/setShowListPane';
import { setShowReadingPane } from 'owa-mail-layout/lib/actions/setShowReadingPane';
import { action } from 'satcheljs/lib/legacy';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';

/**
 * Orchestrator for new message for showing list pane and reading pane
 */
export default action('onNewMessage')(function onNewMessage(openInTab: boolean) {
    if (!openInTab) {
        setShowReadingPane(true /* showReadingPane */);
        setShowListPane(!isReadingPanePositionOff() /* showListPane */);
    }
});
