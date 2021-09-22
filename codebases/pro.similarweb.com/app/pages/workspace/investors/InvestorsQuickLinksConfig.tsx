import { SWReactIcons } from "@similarweb/icons";

export const quickLinks = [
    {
        header: "workspaces.investors.quicklinks.header.analyzecompany",
        title: "workspaces.investors.quicklinks.header.title.analyzecompany",
        text: "workspaces.investors.quicklinks.header.text.analyzecompany",
        state: "websites_root-home",
        params: undefined,
        target: undefined,
        iconComponent: <SWReactIcons iconName="direct-traffic" />,
    },
    {
        header: "workspaces.investors.quicklinks.header.4",
        title: "workspaces.investors.quicklinks.header.title.4",
        text: "workspaces.investors.quicklinks.header.text.4",
        state: "industryAnalysis-overview",
        target: undefined,
        params: {
            category: "All",
            country: "999",
            duration: "3m",
            webSource: "Total",
        },
        iconComponent: <SWReactIcons iconName={"competitors-icon"} size={"md"} />,
    },
    {
        header: "workspaces.investors.quicklinks.header.2",
        title: "workspaces.investors.quicklinks.header.title.2",
        text: "workspaces.investors.quicklinks.header.text.2",
        state: undefined,
        params: undefined,
        target: "benchmark",
        iconComponent: <SWReactIcons iconName={"benchmark"} size={"md"} />,
    },
    {
        header: "workspaces.investors.quicklinks.header.conversion",
        title: "workspaces.investors.quicklinks.header.title.conversion",
        text: "workspaces.investors.quicklinks.header.text.conversion",
        state: "conversion-homepage",
        iconComponent: <SWReactIcons iconName={"funnel-colored"} size={"md"} />,
        target: undefined,
        params: undefined,
    },
];

export const extensionLinks = [
    {
        title: "workspaces.investors.quicklinks.header.title.5",
        text: "workspaces.investors.quicklinks.header.text.5",
        iconComponent: <SWReactIcons iconName="chrome" />,
        href:
            "https://chrome.google.com/webstore/detail/similarweb-traffic-rank-w/hoklmmgfnpapgjgcpechhaamimifchmp?hl=en",
        target: "_blank",
        downloadText: "download now",
        dataAutomation: "downloadLinkChromeExtension",
    },
];
