import { openEventQuickComposeView } from '../actions/publicActions';
import { pushNewView } from '../actions/timePanelStoreActions';
import { verifyValidSource } from '../utils/verifyValidSource';
import { lazyOpenComposeFormInline } from 'owa-time-panel-compose';
import { openTimePanel, popView } from 'owa-time-panel-bootstrap';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const openEventQuickComposeViewOrchestrator = orchestrator(
    openEventQuickComposeView,
    actionMessage => {
        const { source, entrySource, event } = actionMessage;

        // verify source for telemetry purposes
        if (!verifyValidSource(source)) {
            return;
        }

        // make sure panel is open
        openTimePanel(source);

        // handle any existing compose forms
        if (getCurrentPanelView() === 'ComposeForm') {
            //VSO 54580 : Do not popView away from dirty compose form
            popView();
        }

        // open directly to compose form
        pushNewView('ComposeForm');
        lazyOpenComposeFormInline.importAndExecute(entrySource, event);
    }
);
