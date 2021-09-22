import { swSettings } from "common/services/swSettings";
import { SWReactIcons } from "@similarweb/icons";

export const quickLinks = [
    {
        header: "workspaces.sales.quicklinks.header.3",
        title: "workspaces.sales.quicklinks.header.title.3",
        text: "workspaces.sales.quicklinks.header.text.3",
        state: undefined,
        iconComponent: <SWReactIcons iconName="report-empty-state" />,
        target: "custom",
        params: undefined,
        trackIndex: 3,
    },
];

export const extensionLinks = [
    {
        title: "workspaces.sales.quicklinks.header.title.5",
        text: "workspaces.sales.quicklinks.header.text.5",
        iconComponent: <SWReactIcons iconName="chrome" />,
        href:
            "https://chrome.google.com/webstore/detail/similarweb-traffic-rank-w/hoklmmgfnpapgjgcpechhaamimifchmp?hl=en",
        target: "_blank",
        downloadText: "download now",
        dataAutomation: "downloadLinkChromeExtension",
        trackIndex: 4,
    },
];

export const findNewLeadsBox = {
    title: "workspace.sales.quick-link.search-new-leads.title",
    text: "workspace.sales.quick-link.search-new-leads.description",
    iconComponent: <SWReactIcons iconName="phrases" />,
    isShowBox: swSettings?.components?.SalesWorkspace?.resources?.ShowSavedSearches ?? false,
};
