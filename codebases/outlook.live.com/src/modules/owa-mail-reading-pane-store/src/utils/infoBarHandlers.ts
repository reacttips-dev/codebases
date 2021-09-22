import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import type ItemViewState from '../store/schema/ItemViewState';
import type InfoBarMessageViewStateCreator from 'owa-info-bar/lib/schema/InfoBarMessageViewStateCreator';

const infoBarAddHandler = (viewState: ItemViewState) => (
    messageId: string,
    infoBarMessageViewStateCreator: InfoBarMessageViewStateCreator
) => {
    addInfoBarMessage(viewState, messageId, infoBarMessageViewStateCreator);
};

const infoBarRemoveHandler = (viewState: ItemViewState) => (messageId: string) => {
    removeInfoBarMessage(viewState, messageId);
};

const infoBarGetIdsHandler = (viewState: ItemViewState) => () => {
    return viewState.infoBarIds;
};

export { infoBarAddHandler, infoBarRemoveHandler, infoBarGetIdsHandler };
