import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";

export const growHomepageTiles = (cigLink?: string) => {
    const keywordGeneratorDisabled = swSettings.components.KeywordsGenerator.resources.IsDisabled;
    return [
        ...(cigLink
            ? [
                  {
                      Name: i18nFilter()("topbar.tabs.Track.cig.title"),
                      Url: !cigLink.startsWith("/") ? "/#/tools" : cigLink,
                      IconName: "tile-cig",
                      Description: i18nFilter()("tile.cig.description"),
                      trackName: "report generator tile/cig",
                      isBeta: true,
                      onClick: !cigLink.startsWith("/") ? () => window.open(cigLink) : null,
                  },
              ]
            : []),
        ...(keywordGeneratorDisabled
            ? []
            : [
                  {
                      Name: i18nFilter()("topbar.tabs.grow.keyword_generator.title"),
                      Url: "/#/keyword/keyword-generator-tool",
                      IconName: "tile-keyword-generator",
                      Description: i18nFilter()("tile.keyword_generator.description"),
                      isBeta: false,
                      isNew: true,
                      trackName: "keyword generator tool/Wizard",
                  },
              ]),
    ];
};
