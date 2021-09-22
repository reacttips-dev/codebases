import readingPaneStore from '../store/Store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setShouldShowMobileUpsellEmptyState',
    (shouldShowMobileUpsellEmptyState: boolean): void => {
        readingPaneStore.shouldShowMobileUpsellEmptyState = shouldShowMobileUpsellEmptyState;
    }
);
