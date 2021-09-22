import type DockingViewState from '../store/schema/DockingViewState';

export default function createDockingViewState(
    minBodyHeight: number,
    allowStickyDocking: boolean
): DockingViewState {
    return {
        isBottomDocking: false,
        minBodyHeight,
        scrollLeft: 0,
        scrollBarHeight: 0,
        dockingWidth: 0,
        bottomDockingBottom: 0,
        useStickyDocking: allowStickyDocking && browserSupportSticky(),
        initialVisiblePart: null,
        dockingTriggerPart: null,
    };
}

let supportSticky: { value: boolean } = null;

function browserSupportSticky() {
    if (!supportSticky) {
        supportSticky = {
            value:
                cssPropertyValueSupported('position', 'sticky') &&
                typeof IntersectionObserver == 'function',
        };
    }
    return supportSticky.value;
}

function cssPropertyValueSupported(prop: string, value: string) {
    const d = document.createElement('div');
    d.style[prop] = value;
    return d.style[prop] === value;
}
