import { getStore } from '../store/Store';
import { isDeepLink } from 'owa-url';

export default function getPrimaryTabId(): string {
    return isDeepLink() ? getStore().deeplinkId?.id : getStore().primaryReadingPaneTabId?.Id;
}
