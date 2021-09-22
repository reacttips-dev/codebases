import { mutatorAction } from 'satcheljs';
import type ExtendedCardViewState from '../store/schema/ExtendedCardViewState';

export default mutatorAction(
    'setCoverOriginalContent',
    (extendedCardViewState: ExtendedCardViewState, shoudCoverOriginalContent: boolean) => {
        if (extendedCardViewState) {
            extendedCardViewState.coverOriginalContent = shoudCoverOriginalContent;
        }
    }
);
