import type { ContentHandler } from 'owa-controls-content-handler-base';
import { logUsage } from 'owa-analytics';
import { lazyCreateConfettiAnimation } from 'owa-confetti-v2';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';

import {
    CONFETTI_WIDTH,
    CONFETTI_HEIGHT,
    CONFETTI_TIMEOUT,
    CONFETTI_EVENT,
} from 'owa-confetti-v2/lib/utils/constants';
export const CONFETTI_HANDLER_NAME = 'confettiHandler';
const KEYWORDS = ['happy birthday', 'congrats', 'congratulations'];
const MOUSE_ENTER_EVENT = 'mouseenter';

import styles from 'owa-confetti-v2/lib/components/ConfettiStyles.scss';

export function getHandleConfetti(
    body: BodyContentType,
    fireOnCreate: boolean
): (element: HTMLElement, keyword: string) => void {
    return (element: HTMLElement, keyword: string) => {
        element.classList.add(styles.confetti);

        // Log ConfettiKeywordHighlighted datapoint
        logUsage('Confetti_KeywordHighlighted', [keyword]);

        if (body?.Value && body.Value.indexOf(element.textContent) >= 0) {
            lazyCreateConfettiAnimation.import().then(createConfettiAnimation => {
                const confettiAnimation = createConfettiAnimation();
                const elementPosition = element.getBoundingClientRect();

                // Automatically fire confetti if the highlighted keyword is visible (VSO 19582)
                // and the message is unread (VSO 29582)
                if (isElementVisibleInViewport(elementPosition) && fireOnCreate) {
                    startConfetti(
                        keyword,
                        element,
                        elementPosition,
                        confettiAnimation,
                        true /* startedAutomatically */
                    );
                }

                const confettiListener = (ev: MouseEvent) => {
                    setTimeout(() => {
                        startConfetti(
                            keyword,
                            element,
                            elementPosition,
                            confettiAnimation,
                            false /* startedAutomatically */
                        );
                    }, CONFETTI_TIMEOUT);
                };
                element.addEventListener(MOUSE_ENTER_EVENT, confettiListener);
                element[CONFETTI_EVENT] = confettiListener;
            });
        }
    };
}

function isElementVisibleInViewport(elementPosition: ClientRect): boolean {
    return (
        elementPosition.top >= 0 &&
        elementPosition.left >= 0 &&
        elementPosition.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        elementPosition.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isConfettiRunning(elementChildren: HTMLCollection): boolean {
    // An event listener removes the confetti elements when the animation is over
    // The element having child elements signifies the animation is still running
    return elementChildren && elementChildren.length > 0;
}

function startConfetti(
    keyword: string,
    element: HTMLElement,
    elementPosition: ClientRect,
    confettiAnimation: HTMLElement,
    startedAutomatically: boolean
) {
    if (!isConfettiRunning(element.children)) {
        // Position confetti animation so it is directly on top of and vertically aligned
        // with the highlighted keyword element
        confettiAnimation.style.position = 'fixed';

        // VSO 31412: The element position needs to be recalculated when the
        // animation is triggered manually, in case the page has been scrolled
        if (!startedAutomatically) {
            elementPosition = element.getBoundingClientRect();
        }

        confettiAnimation.style.top = elementPosition.top.toString() + 'px';
        confettiAnimation.style.left = elementPosition.left.toString() + 'px';
        confettiAnimation.style.marginTop =
            (element.offsetHeight - CONFETTI_HEIGHT).toString() + 'px';
        confettiAnimation.style.marginLeft =
            ((element.offsetWidth - CONFETTI_WIDTH) * 0.5).toString() + 'px';

        // Re-adding the animation to the DOM allows it to be replayed
        element.appendChild(confettiAnimation);

        // Log ConfettiTriggered datapoint
        logUsage(
            startedAutomatically ? 'Confetti_TriggeredAutomatically' : 'Confetti_TriggeredManually',
            [keyword]
        );
    }
}

function removeConfetti(elements: HTMLElement[]) {
    if (elements) {
        elements.forEach(element => {
            const confettiListener = element[CONFETTI_EVENT];
            if (confettiListener) {
                element.removeEventListener(MOUSE_ENTER_EVENT, confettiListener);
                element[CONFETTI_EVENT] = null;
            }
        });
    }
}

export default function getConfettiHandler(
    body: BodyContentType,
    fireOnCreate: boolean
): ContentHandler {
    return {
        cssSelector: null,
        keywords: KEYWORDS,
        handler: getHandleConfetti(body, fireOnCreate),
        undoHandler: removeConfetti,
    };
}
