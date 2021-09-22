import TabViewState, { TabType } from '../store/schema/TabViewState';

interface TabHandler {
    onActivate?: (viewState: TabViewState) => void;
    onDeactivate?: (viewState: TabViewState) => void;
    onPopout?: (viewState: TabViewState, targetWindow: Window) => void;
    canClose?: (viewState: TabViewState) => boolean | Promise<boolean>;
    canShowTab?: (viewState: TabViewState) => boolean;
    onBlurProjection?: (viewState: TabViewState) => void;
    onBeforeCloseMainWindow?: (viewState: TabViewState) => string;
    reloadAsDeeplink?: (viewState: TabViewState, urlParams?: Record<string, string>) => void;
}

export default TabHandler;

const tabHandlers: { [type: string]: TabHandler } = {};

export function registerTabHandler(type: TabType, handler: TabHandler) {
    tabHandlers[TabType[type]] = handler;
}

export function getTabHandler(type: TabType): TabHandler {
    return tabHandlers[TabType[type]];
}
