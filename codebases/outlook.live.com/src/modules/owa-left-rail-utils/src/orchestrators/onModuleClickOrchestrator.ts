import onModuleClick from '../actions/onModuleClick';
import { logUsage } from 'owa-analytics';
import { createLazyOrchestrator } from 'owa-bundling';

export const onModuleClickOrchestrator = createLazyOrchestrator(
    onModuleClick,
    'clone_onModuleClick',
    actionMessage => {
        const { module, currentlySelectedModule, activeModuleAction } = actionMessage;

        // If clicked workload is the selected module and there is an action given for it (ex: mail is to select default folder),
        // then call that action.
        if (module === currentlySelectedModule && activeModuleAction) {
            activeModuleAction();
        }
        logUsage('ModuleSwitch', [currentlySelectedModule.toString(), module.toString()]);
        logUsage('LeftRailAppClick', [module.toString(), currentlySelectedModule.toString()]);
    }
);
