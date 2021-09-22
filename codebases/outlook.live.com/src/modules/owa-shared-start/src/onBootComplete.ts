import * as AriaUtils from './ariaUtils';
import { createBootReliabilityAriaEvent } from './createBootReliabilityAriaEvent';

export function onBootComplete(start?: number) {
    let timings = window.performance?.now && {
        start,
        plt: Math.floor(window.performance.now()),
    };

    AriaUtils.postSignal(createBootReliabilityAriaEvent('ok', undefined, timings));
}
