import { getHostItem } from 'owa-addins-store';
import { when } from 'mobx';

export function hasHighlightableTerms(index: string) {
    return !!getHostItem(index) && getHostItem(index).contextualTerms != null;
}

export function getHighlightableTerms(index: string): string[] {
    if (!hasHighlightableTerms(index)) {
        return null;
    }

    return [...getHostItem(index).contextualTerms.keys()];
}

export default function whenItemHasContextualAddinKeywords(
    hostItemIndex: string,
    delegate: (keywords: string[]) => void
): () => void {
    return when(
        () => hasHighlightableTerms(hostItemIndex),
        () => delegate(getHighlightableTerms(hostItemIndex))
    );
}
