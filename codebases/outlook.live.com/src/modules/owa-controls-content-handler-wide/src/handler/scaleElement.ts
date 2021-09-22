export const MIN_SCALE_ATTR_NAME = 'min-scale';
export const MAX_SCALE = 1;
const CONTAINER_MIN_HEIGHT = 40;

export default function scaleElement(
    element: HTMLElement,
    availableWidth: number,
    isRTL: (element: HTMLElement) => boolean,
    scaleElementContainerClassName: string,
    onScaleElement: (elementWrapper: HTMLElement, element: HTMLElement, scale: number) => void
) {
    let currentWidth = element.offsetWidth;
    if (availableWidth > 0 && currentWidth > 0) {
        // offsetWidth excludes margins, need to extract them from availableWidth.
        availableWidth -= getLeftRightMargins(element);
        let scale = availableWidth / currentWidth;
        let elementWrapper: HTMLElement;

        if (
            element.parentElement &&
            element.parentElement.className.indexOf(scaleElementContainerClassName) >= 0
        ) {
            elementWrapper = element.parentElement;
        }

        if (scale < MAX_SCALE) {
            element.style.transform = 'scale(' + scale + ', ' + scale + ')';
            element.style.transformOrigin = isRTL(element) ? 'top right' : 'top left';
            element.setAttribute(MIN_SCALE_ATTR_NAME, scale.toString());

            if (!elementWrapper) {
                elementWrapper = wrap(element);
            }

            // scale doesn't update element's height accordingly.
            // we should do so by creating a wrapper with updated height.
            // ensure container has min height of CONTAINER_MIN_HEIGHT so ScaleControl is shown in full.
            elementWrapper.style.height =
                Math.max(getWrapperHeightWhenScaled(element, scale), CONTAINER_MIN_HEIGHT) + 'px';
        } else if (element.scrollWidth > availableWidth) {
            if (elementWrapper === undefined || elementWrapper === null) {
                // This is the case where element has spilling content because it has descendants with fixed widths.
                elementWrapper = wrap(element);
            }
        }

        if (elementWrapper && onScaleElement) {
            onScaleElement(elementWrapper, element, scale);
        }
    }
}

export function undoScaleAllElements(
    elements: HTMLElement[],
    scaleElementContainerClassName: string,
    wideContentHostClassName: string,
    onUndoScaleElement: (elementWrapper: HTMLElement) => void
) {
    for (let i = elements.length - 1; i >= 0; i--) {
        // Not all table elements are scaled,
        // filter out the ones that don't have the scale containers.
        let container = elements[i].parentElement;
        if (container && container.className.indexOf(scaleElementContainerClassName) < 0) {
            elements.splice(i, 1);
        }
    }

    if (elements.length > 0) {
        let wideContentHost = getWideContentHost(elements[0], wideContentHostClassName);
        if (wideContentHost) {
            let shouldChangeHostWidth = true;
            let containers = wideContentHost.querySelectorAll(`.${scaleElementContainerClassName}`);
            for (let i = 0; i < containers.length; i++) {
                let container = containers[i] as HTMLElement;
                let element = container.children[0] as HTMLElement;
                if (elements.indexOf(element) >= 0) {
                    undoScaleElement(element, scaleElementContainerClassName, onUndoScaleElement);
                } else {
                    // If there're still scaled elements not being undone in the host
                    // don't change host width.
                    // E.g. scaled elements are in first body and quoted body, which belong to the same host.
                    // When quoted body gets collapsed but first body is still shown, do not change the host width.
                    shouldChangeHostWidth = false;
                }
            }

            if (shouldChangeHostWidth) {
                shrinkWideContentHost(wideContentHost);
            }
        } else {
            elements.forEach(element => {
                undoScaleElement(element, scaleElementContainerClassName, onUndoScaleElement);
            });
        }
    }
}

export function getWideContentHost(
    element: HTMLElement,
    wideContentHostClassName: string
): HTMLElement {
    let wideContentHost: HTMLElement = null;
    while (element) {
        if (element.className == wideContentHostClassName) {
            wideContentHost = element;
            break;
        } else {
            element = element.parentElement;
        }
    }

    return wideContentHost;
}

function undoScaleElement(
    element: HTMLElement,
    scaleElementContainerClassName: string,
    onUndoScaleElement: (elementWrapper: HTMLElement) => void
) {
    if (element.getAttribute(MIN_SCALE_ATTR_NAME)) {
        // found a scaled element, undo all operations.
        element.style.transform = '';
        element.style.transformOrigin = '';
        element.removeAttribute(MIN_SCALE_ATTR_NAME);
    }

    let elementWrapper = element.parentElement;
    if (elementWrapper.className.indexOf(scaleElementContainerClassName) >= 0) {
        unwrap(element);
        if (onUndoScaleElement) {
            onUndoScaleElement(elementWrapper);
        }
    }
}

function shrinkWideContentHost(wideContentHost: HTMLElement) {
    wideContentHost.style.width = '';
    wideContentHost.style.paddingRight = '0';
}

function getWrapperHeightWhenScaled(element: HTMLElement, scale: number): number {
    let currentHeight = element.offsetHeight;
    return Math.ceil(currentHeight * scale) + getTopBottomMargins(element);
}

function wrap(element: HTMLElement): HTMLElement {
    let wrapper = document.createElement('div');
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
}

function unwrap(element: HTMLElement) {
    let oldParent = element.parentNode;
    let newParent = oldParent.parentNode;
    newParent.insertBefore(element, oldParent);
    newParent.removeChild(oldParent);
}

export function getLeftRightMargins(element: HTMLElement): number {
    let computedStyles = window.getComputedStyle(element, null);
    let marginLeft = parseInt(computedStyles.marginLeft) || 0;
    let marginRight = parseInt(computedStyles.marginRight) || 0;
    // Bug fix: https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/111050
    // On some browsers(chrome versions >= 83), center the table by align=center or margin:0 auto will result in negative margins in computed styles
    // It will affect the calculation of scale in wide content handler, need to pass 0 instead
    marginLeft = Math.max(marginLeft, 0);
    marginRight = Math.max(marginRight, 0);
    return marginLeft + marginRight;
}

function getTopBottomMargins(element: HTMLElement): number {
    let computedStyles = window.getComputedStyle(element, null);
    let marginTop = parseInt(computedStyles.marginTop) || 0;
    let marginBottom = parseInt(computedStyles.marginBottom) || 0;
    return marginTop + marginBottom;
}
