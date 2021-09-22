import ResizeObserver from 'resize-observer-polyfill';
import * as React from 'react';
import { RectDimensions, updateFrame } from 'owa-client-pie/lib/system.g';
import * as trace from 'owa-trace';

interface ObservedHeaderObject {
    id: string;
    elem: HTMLElement | null;
}

export function useUpdateFrame(
    titleBarRef: React.MutableRefObject<HTMLElement | null>,
    excludedIds: string[],
    windowId?: string,
    windowObj?: Window
) {
    React.useEffect(() => {
        const titleBarElement = titleBarRef.current;
        if (titleBarElement) {
            const observedElems: ObservedHeaderObject[] = excludedIds.map(id => ({
                id,
                elem: null,
            }));
            const resizeObserver = new ResizeObserver(() =>
                onResizeElement(titleBarElement, excludedIds, windowId, windowObj)
            );
            const mutationObserver: MutationObserver = new MutationObserver(() => {
                for (let observed of observedElems) {
                    const elem = document.getElementById(observed.id);
                    if (elem != observed.elem) {
                        // if we already have an observed element then we need to check if they are different
                        // so we can unobserve
                        if (observed.elem) {
                            resizeObserver.unobserve(observed.elem);
                        }
                        if (elem) {
                            observed.elem = elem;
                            resizeObserver.observe(elem);
                        }
                    }
                }
            });
            resizeObserver.observe(titleBarElement);
            mutationObserver.observe(titleBarElement, { childList: true, subtree: true });
            onResizeElement(titleBarElement, excludedIds, windowId, windowObj);
            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
            };
        }
        return () => {};
    }, [titleBarRef.current]);
}

/**
 * onResizeElement calculates all known clickable/interactable elements in the OneOutlook
 * title bar, and then excludes those areas when determining which areas should be
 * "draggable" areas. This is done through a post message sent back to client-native-host.
 */
function onResizeElement(
    titleBar: HTMLElement,
    excludedIds: string[],
    windowId?: string,
    windowObj: Window = window
) {
    const titleBarRect = titleBar.getBoundingClientRect();
    const data = {
        window: {
            width: Math.floor(windowObj.innerWidth),
            height: Math.floor(windowObj.innerHeight),
        },
        titleBar: {
            left: Math.floor(titleBarRect.x),
            top: Math.floor(titleBarRect.y),
            width: Math.floor(titleBarRect.width),
            height: Math.floor(titleBarRect.height),
        },
        excluded: getDimensions(windowObj.document, excludedIds),
    };
    if (data.titleBar.width <= 0) {
        return;
    }
    updateFrame(data, windowId || '').catch(e => {
        trace.errorThatWillCauseAlert('CouldNotUpdateFrame', e);
    });
}

const getDimensions = (documentObj, excludedIds) => {
    return <RectDimensions[]>excludedIds
        .map(elementId => {
            const elem = documentObj.getElementById(elementId);

            if (elem) {
                const boundingRect = elem.getBoundingClientRect();

                if (boundingRect.x < 0) {
                    return null;
                }

                return {
                    left: Math.floor(boundingRect.x),
                    top: Math.floor(boundingRect.y),
                    width: Math.floor(boundingRect.width),
                    height: Math.floor(boundingRect.height),
                };
            }

            return null;
        })
        .filter(d => d);
};
