import { mutatorAction } from 'satcheljs';
import type ItemPartViewState from '../store/schema/ItemPartViewState';

export default mutatorAction(
    'updateShouldShowCLPLabel',
    (viewstate: ItemPartViewState, shouldShowCLPLabel: boolean) => {
        if (viewstate) {
            viewstate.shouldShowCLPLabel = shouldShowCLPLabel;
        }
    }
);
