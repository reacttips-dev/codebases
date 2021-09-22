import html2canvas from "html2canvas";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { EmailTemplateValues } from "../../types/email";
import { BenchmarksVisualizationType, METRICS_TRANSLATION_KEY } from "../../constants";
import createBenchmarkItemService from "../benchmark-item/benchmarkItemServiceFactory";
import createLeaderboardService from "../leaderboard/leaderboardService";
import { getNumberSuffixNaive } from "../../helpers";

const createEmailService = (
    itemService: ReturnType<typeof createBenchmarkItemService>,
    leaderboardService: ReturnType<typeof createLeaderboardService>,
    dateTimeService: { formatWithMoment(date: string | Date, format?: string): string },
) => {
    const {
        domain: prospectDomain,
        color: prospectColor,
        value: prospectValue,
    } = itemService.formattedProspect;
    const translate = i18nFilter();
    const date = dateTimeService.formatWithMoment(itemService.bResult.currData, "MMMM YYYY");
    const translatedMetric = translate(
        `${METRICS_TRANSLATION_KEY}.${itemService.bResult.metric}.title`,
    );

    const generateChartBase64 = async () => {
        try {
            return (await html2canvas(document.querySelector(`#${itemService.id}`)))
                .toDataURL("image/png")
                .split(";base64,")[1];
        } catch (e) {
            swLog.error("Error generating chart image: ", e);
            return "";
        }
    };

    const getEmailSubject = () => {
        // TODO: "in" was not translated
        return `${translatedMetric} in ${itemService.prospect.domain}, ${itemService.countryName}, ${date}`;
    };

    const getWebsitesList = () => {
        const competitorsColors = itemService.competitorsColors;

        return itemService.currentCompetitors.reduce(
            (websites, c, i) => {
                return websites.concat({
                    domain: c.domain,
                    iconColor: competitorsColors[i],
                });
            },
            [{ domain: prospectDomain, iconColor: prospectColor }],
        );
    };

    const buildLeaderboardWebsitesList = () => {
        return leaderboardService.websitesList.map((website, index) => ({
            ...website,
            prefix: `${index + 1}<span style="font-size:14px;">${getNumberSuffixNaive(
                index + 1,
            )}</span>`,
        }));
    };

    return {
        async build(visualisation: BenchmarksVisualizationType): Promise<EmailTemplateValues> {
            const websites = getWebsitesList();
            const chartBase64 =
                visualisation !== BenchmarksVisualizationType.LEADERBOARD
                    ? await generateChartBase64()
                    : "";
            const { text } = itemService.getSummaryTextService().getTexts();

            return {
                date: date,
                chart: chartBase64,
                competitors: websites,
                benchmarksSummary: text,
                points: itemService.points,
                chartTitle: translatedMetric,
                topic: itemService.bResult.topic,
                country: itemService.bResult.country,
                benchmark: itemService.bResult.metric,
                prospect: prospectDomain,
                prospectValue: prospectValue,
                prospectIsLosing: itemService.isProspectLosing,
                prospectColor: itemService.formattedProspect.color,
                avgCompetitorsColor: itemService.competitorsAverageColor,
                avgCompetitorsTitle: translate(itemService.competitorsAverageTitleKey, {
                    comparedCompetitors: itemService.currentCompetitors.length,
                }),
                avgCompetitorsValue: itemService.formattedAverage,
                opportunity: parseFloat(itemService.formattedOpportunity),
                opportunityTitle: translate(itemService.opportunityTitleKey),
                subject: getEmailSubject(),
                visualisationMode: visualisation,
                leaderboardList: buildLeaderboardWebsitesList(),
                leaderboardSubTitle: leaderboardService.secondaryText,
                leaderboardTitle: leaderboardService.primaryText,
                prospectIsLeader: leaderboardService.leaderDomain === itemService.prospect.domain,
            };
        },
    };
};

export default createEmailService;
