import { i18nFilter } from "filters/ngFilters";
import { wrapDomainNamePartsWithHTMLTag } from "pages/sales-intelligence/helpers/helpers";
import createBenchmarkItemService from "../benchmark-item/benchmarkItemServiceFactory";
import { combineProspectWithCompetitors, competitorIsOutPerforming } from "../../helpers";

const createLeaderboardService = (
    itemService: ReturnType<typeof createBenchmarkItemService>,
    assetService: { assetUrl(path: string): string },
) => {
    const translate = i18nFilter();
    const outPerformingDetails = itemService.bResult.outperformingCompetitors;
    const average = outPerformingDetails?.avgValue;
    const outperformingWebsites = itemService.bResult.competitors.filter(competitorIsOutPerforming);
    const outPerformingLeaderValue = outperformingWebsites[0]?.value;
    const numberOfOutPerformingSites = outperformingWebsites.length;

    return {
        get websitesList() {
            return combineProspectWithCompetitors(
                itemService.prospect,
                itemService.bResult.competitors,
            );
        },
        get outPerformingAverage() {
            if (typeof average === "undefined") {
                return "N/A";
            }

            return itemService.defaultFormatter(average);
        },
        get leaderValue() {
            if (typeof outPerformingLeaderValue === "undefined") {
                return "N/A";
            }

            return itemService.defaultFormatter(outPerformingLeaderValue);
        },
        get leaderDomain() {
            return this.websitesList[0]?.domain;
        },
        get icon() {
            if (numberOfOutPerformingSites === 0) {
                return assetService.assetUrl("/images/trophy.svg");
            }

            return assetService.assetUrl("/images/spaceship.svg");
        },
        get primaryText() {
            return translate("si.insights.leaderboard.rank_text", {
                prospectDomain: wrapDomainNamePartsWithHTMLTag(itemService.prospect.domain),
                prospectRank: `#${numberOfOutPerformingSites + 1}`,
                country: itemService.countryName,
            });
        },
        get secondaryText() {
            if (numberOfOutPerformingSites < 1) {
                return "";
            }

            if (numberOfOutPerformingSites === 1) {
                return translate("si.insights.leaderboard.second_place_text", {
                    leaderDomain: this.leaderDomain,
                    leaderValue: this.leaderValue,
                });
            }

            return translate(
                `si.insights.leaderboard.outperform_text.${itemService.bResult.metric}`,
                {
                    outperformingAvg: this.outPerformingAverage,
                    numberOfOutperformingSites: numberOfOutPerformingSites,
                },
            );
        },
    };
};

export default createLeaderboardService;
