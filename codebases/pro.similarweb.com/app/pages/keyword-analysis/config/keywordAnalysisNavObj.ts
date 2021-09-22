import { Injector } from "common/ioc/Injector";
import { canCreateSneak } from "../../sneakpeek/utilities";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";
import { keywordService } from "pages/keyword-analysis/keywordService";

export const navObj = () => {
    return {
        navList: [
            {
                name: "keyword-analysis",
                title: "keywordAnalysis.page.title2",
                isOpen: true,
                subItems: [
                    {
                        title: "keyword.analysis.nav.overview.title",
                        name: "overview",
                        lockIcon: !keywordService.hasKeywordAdsPermission,
                        state: "keywordAnalysis-overview",
                        defaultQueryParams: {
                            webSource: "Total",
                        },
                    },
                    {
                        title: "KeywordAnalysis.nav.total.title",
                        name: "total",
                        lockIcon: !keywordService.moduleAuthorized,
                        state: "keywordAnalysis-total",
                    },
                    {
                        title: "KeywordAnalysis.nav.organic.title2",
                        name: "organic",
                        lockIcon: !keywordService.moduleAuthorized,
                        state: "keywordAnalysis-organic",
                    },
                    {
                        title: "KeywordAnalysis.nav.paid.title2",
                        name: "paid",
                        lockIcon: !keywordService.moduleAuthorized,
                        state: "keywordAnalysis-paid",
                    },
                    {
                        title: "KeywordAnalysis.mobile.header.title2",
                        name: "mobile",
                        hidden: false,
                        lockIcon: !keywordService.hasMobileWebSearchPermission,
                        isBeta: true,
                        state: "keywordAnalysis-mobileweb",
                    },
                    {
                        title: "keywordAnalysis.geo.page.title",
                        name: "geo",
                        hidden: false,
                        lockIcon: !keywordService.moduleAuthorized,
                        isNew: true,
                        state: "keywordAnalysis-geo",
                    },
                    {
                        title: "KeywordAnalysis.nav.ads.title",
                        name: "ads",
                        lockIcon: !keywordService.hasKeywordAdsPermission,
                        state: "keywordAnalysis-ads",
                        defaultQueryParams: {
                            webSource: "Desktop",
                        },
                    },
                    {
                        title: "KeywordAnalysis.nav.plaresearch.title",
                        name: "plaResearch",
                        lockIcon: !keywordService.hasKeywordAdsPermission,
                        state: "keywordAnalysis-plaResearch",
                        defaultQueryParams: {
                            webSource: "Desktop",
                        },
                    },
                ],
            },
            {
                name: "keyword-analysis-generator",
                title: "keywordAnalysis.page.generator.title",
                isOpen: true,
                subItems: [
                    {
                        title: "keywordAnalysis.page.generator.subtitle",
                        name: "keyword-generator",
                        state: "keywordAnalysis-generator",
                        lockIcon: !keywordService.hasKeywordsGeneratorPermission,
                        defaultQueryParams: {
                            webSource: "Desktop",
                        },
                    },
                ],
            },
            {
                title: "Sneak Peek",
                name: "keyword-analysis",
                disabled: false,
                subItems: [
                    {
                        title: "Data Query",
                        name: "sneakpeekQuery",
                        state: "keywordAnalysis-sneakpeekQuery",
                    },
                    {
                        title: "Data Results",
                        name: "sneakpeekResults",
                        state: "keywordAnalysis-sneakpeekResults",
                    },
                ],
            },
        ]
            .filter(({ title }) => {
                return title !== "Sneak Peek" ? true : canCreateSneak();
            })
            .map(applyNavItemPermissions),
    };
};
