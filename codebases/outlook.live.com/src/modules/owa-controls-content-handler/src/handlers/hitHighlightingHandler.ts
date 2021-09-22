import type { ContentHandler } from 'owa-controls-content-handler-base';
import { getElementColors, setElementOgColorsIfUnset } from 'owa-content-colors';

export const HIT_HIGHLIGHTING_HANDLER_NAME = 'hitHighlightingHandler';
const HIGHLIGHTING_BACKGROUND_COLOR = '#FFF100';
const HIGHLIGHTING_COLOR = 'black';

export function handleHitHighlighting(element: HTMLElement) {
    const originalColors = getElementColors(element);
    element.style.backgroundColor = HIGHLIGHTING_BACKGROUND_COLOR;
    element.style.color = HIGHLIGHTING_COLOR;
    setElementOgColorsIfUnset(element, originalColors);
}

export default function getHitHighlightingHandler(keywords: string[]): ContentHandler {
    return <ContentHandler>{
        cssSelector: null,
        keywords: keywords,
        handler: handleHitHighlighting,
    };
}
