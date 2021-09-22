import type WindowFeaturesOptions from '../store/schema/WindowFeaturesOptions';
import { isBrowserChrome, isBrowserEDGECHROMIUM } from 'owa-user-agent';

const DEFAULT_POPOUT_MIN_HEIGHT = 600;
const DEFAULT_POPOUT_MIN_WIDTH = 800;
const CASCADE_POPOUT_LOOP_AFTER_COUNT = 8;
const CASCADE_POPOUT_EVERY_OFFSET = 25;

const DEFAULT_WINDOW_FEATURES_OPTIONS: Partial<WindowFeaturesOptions> = {
    location: false,
    menubar: false,
    resizable: true,
    scrollbars: false,
    status: false,
    toolbar: false,
};

// start counter at -1 because we will immediately add 1 later
let nextWindowPositionCounter = -1;

export default function openWindow(
    url: string,
    options: Partial<WindowFeaturesOptions>,
    parentWindow?: Window
): Window {
    try {
        options = rationalizeWindowFeatures(options);
        const childWindow = (parentWindow || window).open(
            url,
            '_blank',
            generateWindowFeaturesString(options)
        );

        // Chromium bug wrt DPI mismatch forces us to do this
        if (isBrowserChrome() || isBrowserEDGECHROMIUM()) {
            childWindow.moveTo(options.left, options.top);
        }

        return childWindow;
    } catch {
        // TODO: Work Item 39263: [PopoutV2] Consider how to handle blocked scenario for popout V2
        return null;
    }
}

/**
 * Generate the string of new window features. e.g.: width=800,height=600,menubar=0,...
 * @param options The properties to override default values
 */
function generateWindowFeaturesString(options: Partial<WindowFeaturesOptions>) {
    function valueOf(value: number | boolean | undefined): string | undefined {
        if (typeof value === 'boolean') {
            return value ? '1' : '0';
        } else if (value) {
            return String(value);
        } else {
            return undefined;
        }
    }

    return (Object.getOwnPropertyNames(options) as (keyof WindowFeaturesOptions)[])
        .map((key: keyof WindowFeaturesOptions) => `${key}=${valueOf(options[key])}`)
        .join(',');
}

/**
 * Make the final decision for the new window features based on defaults and overriding values
 * @param options The properties to override default values
 */
function rationalizeWindowFeatures(options: Partial<WindowFeaturesOptions>) {
    const anchoredOffset = getNextAnchoredOffset();
    const anchoredSizingOptions: Partial<WindowFeaturesOptions> = {
        // empirically-determined to be comfortable-sized
        left: window.screenX + anchoredOffset,
        top: window.screenY + anchoredOffset,
        height: Math.max(25 * Math.pow(window.innerHeight, 1 / 2), DEFAULT_POPOUT_MIN_HEIGHT),
        width: Math.max(8 * Math.pow(window.innerWidth, 2 / 3), DEFAULT_POPOUT_MIN_WIDTH),
    };

    return {
        ...DEFAULT_WINDOW_FEATURES_OPTIONS,
        ...anchoredSizingOptions,
        ...options,
    };
}

function getNextAnchoredOffset() {
    nextWindowPositionCounter = (nextWindowPositionCounter + 1) % CASCADE_POPOUT_LOOP_AFTER_COUNT;
    return CASCADE_POPOUT_EVERY_OFFSET * (nextWindowPositionCounter + 1);
}
