import { orchestrator } from 'satcheljs';
import { openQuickSettings } from 'owa-whats-new/lib/actions/openQuickSettings';

export default orchestrator(openQuickSettings, () => {
    (window as any).O365Shell.FlexPane.OpenFlexPaneForProvider('OwaSettings');
});
