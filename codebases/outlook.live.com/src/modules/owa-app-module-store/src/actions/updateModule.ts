import { Module } from 'owa-workloads';
import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export function initializeModule(newModule: Module) {
    if (!getStore().module) {
        updateModule(newModule);
    }
}

const updateModule = mutatorAction('updateAppModule', (newModule: Module) => {
    const store = getStore();
    if (store.module != newModule) {
        store.module = newModule;
    }
});

export default updateModule;
