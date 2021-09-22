import { mutator } from 'satcheljs';
import { getStore as getLeftRailStore } from '../store/store';
import onModuleClick from '../actions/onModuleClick';
import onAppHostHeaderStartSearch from '../actions/onAppHostHeaderStartSearch';

mutator(onModuleClick, actionMessage => {
    getLeftRailStore().selectedApp = null;
});

mutator(onAppHostHeaderStartSearch, actionMessage => {
    getLeftRailStore().selectedApp = null;
});
