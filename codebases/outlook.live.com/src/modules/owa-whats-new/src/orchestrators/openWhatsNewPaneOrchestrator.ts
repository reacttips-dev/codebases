import { openWhatsNewPane } from '../actions/openWhatsNewPane';
import { orchestrator } from 'satcheljs';

export default orchestrator(openWhatsNewPane, () => {
    (window as any).O365Shell.FlexPane.OpenFlexPaneForProvider('whatsNewPane');
});
