import { logUsage } from 'owa-analytics';
import { createLazyOrchestrator } from 'owa-bundling';
import onOfficeAppClick from '../actions/onOfficeAppClick';

export const onOfficeAppClickOrchestrator = createLazyOrchestrator(
    onOfficeAppClick,
    'clone_onOfficeAppClick',
    actionMessage => {
        const { app, currentlySelectedModule } = actionMessage;

        if (currentlySelectedModule) {
            logUsage('LeftRailAppClick', [app, currentlySelectedModule.toString()]);
        }
    }
);
