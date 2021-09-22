import TabViewState, { TabType, TabState } from './store/schema/TabViewState';

export default {
    TabViewAddTab: {
        name: 'TabViewAddTab',
        customData: (type: TabType, isShown: boolean, makeActive: boolean, data: any) => [
            type,
            isShown,
            makeActive,
        ],
    },
    TabViewCloseTab: {
        name: 'TabViewCloseTab',
        customData: (viewState: TabViewState, forceClose: boolean) => [
            viewState.type,
            viewState.state == TabState.Minimized || viewState.state == TabState.Active, // isShown
            viewState.state == TabState.Active, // isActive
            forceClose,
            viewState.startTime ? new Date().getTime() - viewState.startTime : 0,
        ],
    },
};
