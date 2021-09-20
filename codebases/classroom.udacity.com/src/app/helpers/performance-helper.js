import ttiPolyfill from 'tti-polyfill';

function sendUserTiming(category, subCategory, name, value) {
    if (window.ga) {
        window.ga('send', {
            hitType: 'timing',
            timingCategory: category,
            timingVar: subCategory,
            timingLabel: name,
            timingValue: Math.round(value), // GA wants a round number
        });
    }
}

function trackTTI(name) {
    ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
        sendUserTiming('Time To Interactive', 'tti', name, tti);
    });
}

function trackPageLoad(name) {
    if (window.performance) {
        // performance.now() gets the number of milliseconds since page load
        sendUserTiming('Initial Page Load', 'load', name, performance.now());
    }
}

let tracked = false;

export function trackInitialPageLoad(name) {
    if (!tracked) {
        trackTTI(name);
        trackPageLoad(name);
    }
    tracked = true;
}