import SwcEventNames from './swcEventNames';
import updateIsRecentsInitialized from '../actions/updateIsRecentsInitialized';
import store from '../store/store';

export default function initializeRecents(recentsWrapper: HTMLElement): void {
    if (store.isSwcInitialized) {
        createRecents(recentsWrapper);
    } else {
        window.addEventListener(SwcEventNames.SwcCoreReady, () => {
            onSwcCoreReady(recentsWrapper);
        });
    }
}

function onSwcCoreReady(recentsWrapper: HTMLElement) {
    window.removeEventListener(SwcEventNames.SwcCoreReady, () => {
        onSwcCoreReady(recentsWrapper);
    });
    createRecents(recentsWrapper);
}

function createRecents(recentsWrapper: HTMLElement) {
    if (window.swc) {
        window.swc.API.registerEvent(SwcEventNames.ApiRecentsReady, onRecentsReady);
        window.swc.create('recents', {}, recentsWrapper);
    }
}

function onRecentsReady() {
    updateIsRecentsInitialized(true);
}
