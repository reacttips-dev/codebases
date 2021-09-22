import TabViewState, { TabType } from '../store/schema/TabViewState';

export default function getTabTitle(viewState: TabViewState) {
    switch (viewState.type) {
        case TabType.SecondaryReadingPane:
            return viewState.data.subject;
        default:
            return null;
    }
}
