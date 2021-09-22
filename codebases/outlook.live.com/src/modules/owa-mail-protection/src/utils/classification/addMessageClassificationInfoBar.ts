import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import { MESSAGE_CLASSIFICATION_INFOBAR_MESSAGE_ID } from './constants';

export default function addMessageClassificationInfoBar(viewState: InfoBarHostViewState) {
    // the item should show info bar of Message Classification
    addInfoBarMessage(viewState, MESSAGE_CLASSIFICATION_INFOBAR_MESSAGE_ID);
}
