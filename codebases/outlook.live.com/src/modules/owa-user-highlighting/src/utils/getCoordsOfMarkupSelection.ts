import { MAX_POPUP_ABOVE_LEN } from './constants';
import type { IPoint } from '@fluentui/react/lib/Utilities';

export default function getCoordsOfMarkupSelection(
    rects: ClientRectList,
    selectedText: string
): IPoint {
    const shortText = selectedText.length < MAX_POPUP_ABOVE_LEN;
    const targetRect = shortText ? rects?.[0] : rects?.[rects.length - 1];
    const targetLocation = shortText ? targetRect.top : targetRect.bottom;
    return { x: (targetRect.left + targetRect.right) / 2, y: targetLocation };
}
