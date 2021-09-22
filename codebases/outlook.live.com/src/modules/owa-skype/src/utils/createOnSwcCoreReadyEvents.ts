import initializeSkype from '../utils/initializeSkype';
import SwcEventNames from './swcEventNames';

export default function createOnSwcCoreReadyEvents(chatWrapper: HTMLElement): void {
    window.addEventListener(SwcEventNames.SwcCoreReady, () => {
        onSwcCoreReady(chatWrapper);
    });
}

function onSwcCoreReady(chatWrapper: HTMLElement) {
    window.removeEventListener(SwcEventNames.SwcCoreReady, () => {
        onSwcCoreReady(chatWrapper);
    });
    initializeSkype(chatWrapper);
}
