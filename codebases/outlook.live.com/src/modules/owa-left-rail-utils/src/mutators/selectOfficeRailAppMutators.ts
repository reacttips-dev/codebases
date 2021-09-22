import { mutator, mutatorAction } from 'satcheljs';
import { getStore as getLeftRailStore } from '../store/store';
import onOfficeAppClick from '../actions/onOfficeAppClick';
import isSupportedOfficeRailApp from '../isSupportedOfficeRailApp';
import type { OfficeApp } from '../store/schema/OfficeApp';

mutator(onOfficeAppClick, actionMessage => {
    if (isSupportedOfficeRailApp(actionMessage.app)) {
        getLeftRailStore().selectedApp = actionMessage.app;
    }
});

export const selectOfficeRailApp = mutatorAction('selectOfficeRailApp', (app: OfficeApp) => {
    getLeftRailStore().selectedApp = app;
});
