import { swSettings } from "common/services/swSettings";
import { getPermittedWorkSpacesTypes } from "../../../services/Workspaces.service";

declare const window;

export const menuItemsLinks = (trackId, cigLink?): any[] => {
    const keywordGeneratorDisabled = swSettings.components.KeywordsGenerator.resources.IsDisabled;
    switch (trackId) {
        case "Research":
            return [
                {
                    group: "Web",
                    title: "topbar.tabs.Research.webanalysis.title",
                    icon: "websites",
                    trackName: "Research/websites",
                    description: "topbar.tabs.Research.webanalysis.description",
                    link: "/#/website/home",
                    modules: ["websites", "websites-root"],
                },
                {
                    group: "App",
                    title: "topbar.tabs.Research.appanalysis.title",
                    icon: "apps",
                    trackName: "Research/apps",
                    description: "topbar.tabs.Research.appanalysis.description",
                    link: "/#/apps/home",
                    modules: ["apps"],
                },
                {
                    group: "Web",
                    title: "topbar.tabs.Research.indanalysis.title",
                    icon: "industry",
                    trackName: "Research/industry",
                    description: "topbar.tabs.Research.indanalysis.description",
                    link: "/#/industry/overview/All/999/3m?webSource=Total",
                    modules: ["industryAnalysis"],
                },
                {
                    group: "App",
                    title: "topbar.tabs.Research.appcatanalysis.title",
                    icon: "appscategory",
                    trackName: "Research/appscategory",
                    description: "topbar.tabs.Research.appcatanalysis.description",
                    link: "/#/appcategory/leaderboard/Google/840/All/AndroidPhone/Top%20Free",
                    modules: ["appcategory"],
                },
                {
                    group: "Web",
                    title: "topbar.tabs.Research.keywordanalysis.title",
                    icon: "keyword",
                    trackName: "Research/keyword",
                    description: "topbar.tabs.Research.keywordanalysis.description",
                    link: "/#/keyword/home",
                    modules: ["keywordAnalysis"],
                },
                {
                    group: "App",
                    title: "topbar.tabs.Research.playkeywords.title",
                    icon: "playkeyword",
                    trackName: "Research/playkeyword",
                    description: "topbar.tabs.Research.playkeywords.description",
                    link: "/#/keywords/home",
                    modules: ["keywords"],
                },
                {
                    group: "Web",
                    title: "topbar.tabs.buyerjourney.title",
                    icon: "buyer-journey",
                    trackName: "Research/buyerJourney",
                    description: "topbar.tabs.buyerjourney.description",
                    link: "/#/conversion/home",
                    modules: ["conversion"],
                },
                {
                    group: "Web",
                    title: "topbar.tabs.customsegments.title",
                    icon: "segment",
                    trackName: "Research/websiteSegments",
                    description: "topbar.tabs.customsegments.description",
                    link: "/#/segments/home",
                    modules: ["segments"],
                },
            ];
        case "Tools":
            return [
                ...(cigLink
                    ? [
                          {
                              title: "topbar.tabs.Track.cig.title",
                              icon: "cig",
                              trackName: "Track/CIG",
                              description: "topbar.tabs.Track.cig.description",
                              link: cigLink,
                              modules: ["cig"],
                              openInNewWindow: !cigLink.startsWith("/"),
                              beta: true,
                          },
                      ]
                    : []),
                ...(keywordGeneratorDisabled
                    ? []
                    : [
                          {
                              title: "topbar.tabs.grow.keyword_generator.title",
                              icon: "keyword-generator",
                              trackName: "Tools/KeywordGenerator",
                              description: "topbar.tabs.grow.keyword_generator.description",
                              link: "/#/keyword/keyword-generator-tool",
                              modules: ["keywordAnalysis"],
                              beta: false,
                              new: true,
                          },
                      ]),
            ];
        case "Workspaces":
            const workspaceItems = Object.values(getPermittedWorkSpacesTypes());
            return workspaceItems.length > 1 ? workspaceItems : []; // don't show menu if we have permission to only 1 workspace.
        default:
            return [];
    }
};
