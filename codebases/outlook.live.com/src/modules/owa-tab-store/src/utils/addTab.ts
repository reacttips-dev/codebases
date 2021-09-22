import getActiveContentTab from './getActiveContentTab';
import type SecondaryReadingPaneTabData from '../store/schema/SecondaryReadingPaneTabData';
import TabViewState, { TabType, TabState } from '../store/schema/TabViewState';
import { getGuid } from 'owa-guid';
import addTabViewState from '../actions/addTabViewState';

let nextId = 1;
const SXSID_PREFIX = 'SXSID_';

export default function addTab(
    type: TabType,
    isShown: boolean,
    makeActive: boolean,
    data: any
): string {
    const currentTab = getActiveContentTab();
    const tabId: string = TabType[type] + (nextId++).toString();
    const baseTabViewState = {
        id: tabId,
        state: isShown ? TabState.Minimized : TabState.Hidden,
        startTime: new Date().getTime(),
        parentTabId: currentTab ? currentTab.id : null,
        blink: isShown, // Set blink to true if the tab is shown. It will be set to false in activateTab() if we want to make active
        data: data,
        sxsId: (type === TabType.SxS && data) || SXSID_PREFIX + getGuid(), // re-use sxsId if we pop out from SxS, otherwise, create a new one
    };

    // TODO #35453 break addTab into different functions to make it typesafe at the caller
    let tabViewState: TabViewState = null;
    switch (type) {
        case TabType.Primary:
            tabViewState = { ...baseTabViewState, type: TabType.Primary };
            break;
        case TabType.OverflowMenu:
            tabViewState = {
                ...baseTabViewState,
                type: TabType.OverflowMenu,
                data: data as TabViewState[],
            };
            break;
        case TabType.SecondaryReadingPane:
            tabViewState = {
                ...baseTabViewState,
                type: TabType.SecondaryReadingPane,
                data: data as SecondaryReadingPaneTabData,
            };
            break;
        case TabType.MailCompose:
            tabViewState = {
                ...baseTabViewState,
                type: TabType.MailCompose,
                data: data as string,
                projectionRPTabId: null,
            };
            break;
        case TabType.SxS:
            tabViewState = { ...baseTabViewState, type: TabType.SxS };
            break;
        case TabType.CalendarCompose:
            tabViewState = {
                ...baseTabViewState,
                type: TabType.CalendarCompose,
                data: data as string,
            };
            break;
        case TabType.FloatingChat:
            tabViewState = {
                ...baseTabViewState,
                type: TabType.FloatingChat,
                data: data as string,
                isChatActive: false,
            };
    }

    addTabViewState(tabViewState, makeActive);
    return tabViewState.id;
}
