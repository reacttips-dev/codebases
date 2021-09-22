import { logUsage } from 'owa-analytics';
import {
    getLeftRightMargins,
    getWideContentHost,
    MAX_SCALE,
    MIN_SCALE_ATTR_NAME,
} from 'owa-controls-content-handler-wide';
import datapoints from './datapoints';
import { MountScaleControl, UnmountScaleControl } from './ScaleControl';
import { WIDE_CONTENT_HOST_CLASS_NAME } from './WideContentHost';

import styles from './ScaleElementStyles.scss';
const HAS_HOVERED_ATTR_NAME = 'has-hovered';
const MOUSE_OVER_EVENT_NAME = 'mouseover';

export function onScaleElement(elementWrapper: HTMLElement, element: HTMLElement, scale: number) {
    logUsage(datapoints.WCScaledOrTruncated.name, datapoints.WCScaledOrTruncated.customData(scale));

    if (elementWrapper.className.indexOf(styles.container) < 0) {
        elementWrapper.className = styles.container;
        elementWrapper.addEventListener(MOUSE_OVER_EVENT_NAME, onContainerHover);
        createScaleControl(elementWrapper, element);
    }
}

export function onUndoScaleElement(elementWrapper: HTMLElement) {
    elementWrapper.removeEventListener(MOUSE_OVER_EVENT_NAME, onContainerHover);
    if (elementWrapper.getAttribute(HAS_HOVERED_ATTR_NAME)) {
        logUsage(datapoints.WCScaleContainerHovered.name);
        elementWrapper.removeAttribute(HAS_HOVERED_ATTR_NAME);
    }
    disposeScaleControl(elementWrapper);
}

function onContainerHover(e: MouseEvent) {
    let container = e.currentTarget as HTMLElement;
    container.removeEventListener(MOUSE_OVER_EVENT_NAME, onContainerHover);
    container.setAttribute(HAS_HOVERED_ATTR_NAME, 'true');
}

function createScaleControl(container: HTMLElement, element: HTMLElement) {
    let scaleControlContainer = document.createElement('div');
    scaleControlContainer.className = styles.scaleControlContainer;
    // Prepend scaleControlContainer to container
    // Cannot use .prepend because it is not supported by IE.
    const containerContent = Array.prototype.slice.call(container.childNodes);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(scaleControlContainer);
    containerContent.forEach(childNode => container.appendChild(childNode));
    MountScaleControl(scaleControlContainer, onScaleUp(container, element));
}

function disposeScaleControl(container: HTMLElement) {
    let scaleControlContainers = container.querySelectorAll(`.${styles.scaleControlContainer}`);
    if (scaleControlContainers.length > 0) {
        let scaleControlContainer = scaleControlContainers[0] as HTMLElement;
        UnmountScaleControl(scaleControlContainer);
        container.removeChild(scaleControlContainer);
    }
}

let onScaleUp = (container: HTMLElement, element: HTMLElement) => () => {
    let wideContentHost = getWideContentHost(element, WIDE_CONTENT_HOST_CLASS_NAME);
    if (wideContentHost) {
        // Found the host, so we scale up all scaled elements.
        let maxWidthDelta = 0;
        let containers = wideContentHost.querySelectorAll(`.${styles.container}`);
        for (let i = 0; i < containers.length; i++) {
            let currentContainer = containers[i] as HTMLElement;
            disposeScaleControl(currentContainer);
            let currentElement = currentContainer.children[0] as HTMLElement;
            let currentWidthDelta = scaleUpElement(
                currentContainer,
                currentElement,
                currentElement == element /* needLogDatapoint */
            );
            maxWidthDelta = Math.max(maxWidthDelta, currentWidthDelta);
        }

        enlargeWideContentHost(wideContentHost, element, maxWidthDelta);
    } else {
        // If host is not found, just scale the current element.
        scaleUpElement(container, element, true /* needLogDatapoint */);
        // Let element spill outside container in this case.
        container.style.overflow = 'visible';
        disposeScaleControl(container);
    }
};

function scaleUpElement(
    container: HTMLElement,
    element: HTMLElement,
    needLogDatapoint: boolean
): number {
    let previousElementWidth = container.offsetWidth;
    let currentElementWidth: number;
    let minScale = MAX_SCALE;
    if (element.getAttribute(MIN_SCALE_ATTR_NAME)) {
        minScale = parseFloat(element.getAttribute(MIN_SCALE_ATTR_NAME));
        element.style.transform = 'scale(' + MAX_SCALE + ', ' + MAX_SCALE + ')';
        container.style.height = '';
        currentElementWidth = element.offsetWidth;
    } else {
        currentElementWidth = element.scrollWidth;
    }

    if (needLogDatapoint) {
        logUsage(datapoints.WCScaleUp.name, datapoints.WCScaleUp.customData(minScale));
    }

    currentElementWidth += getLeftRightMargins(element);
    return Math.max(currentElementWidth - previousElementWidth, 0);
}

function enlargeWideContentHost(
    wideContentHost: HTMLElement,
    element: HTMLElement,
    newWidthDelta: number
) {
    let hostWidth = wideContentHost.offsetWidth + newWidthDelta;
    // Add 20px padding right because scrollbar has overlay style in Chrome,
    // content will be cut off without padding.
    wideContentHost.style.width = hostWidth + 'px';
    wideContentHost.style.paddingRight = '20px';
    adjustScrollPosition(element, wideContentHost);
}

function adjustScrollPosition(element: HTMLElement, wideContentHost: HTMLElement) {
    element.scrollIntoView();
    let scrollContainer = wideContentHost;

    // When calling element.scrollIntoView with horizontal scrollbar,
    // browsers (except for Chrome) tend to scroll to the right.
    // We want to keep the horizontal scrollbar to the very left.
    while (scrollContainer) {
        if (
            scrollContainer.scrollWidth > scrollContainer.offsetWidth &&
            window.getComputedStyle(scrollContainer, null).overflowX == 'auto'
        ) {
            // Found the scroll container with horizontal scrollbar present
            scrollContainer.scrollLeft = 0;
            break;
        } else {
            scrollContainer = scrollContainer.parentElement;
        }
    }
}
