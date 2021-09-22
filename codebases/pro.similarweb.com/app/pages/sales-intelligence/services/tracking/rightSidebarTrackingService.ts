import { BenchmarksVisualizationType } from "pages/workspace/sales/sub-modules/benchmarks/constants";

const createRightSidebarTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    return {
        // Settings/Topics
        trackSidebarCloseIconClicked(tabName: string) {
            track("sidebar header", "click", `close sidebar/${tabName}`);
        },
        trackTopicsOpenClicked() {
            track("sidebar onboarding", "open topics", "initial topic selection");
        },
        trackSettingsTopicApplied(
            previousTopicName: string,
            appliedTopicName: string,
            isPopular: boolean,
        ) {
            track(
                "sidebar topics panel",
                "select topic",
                `${appliedTopicName}/${isPopular ? "YES" : "NO"}/${previousTopicName}`,
            );
        },
        trackSidebarTabClicked(clickedTabName: string, previousTabName: string, topicName: string) {
            track(
                "sidebar tab header",
                "change tab",
                `${clickedTabName}/${topicName}/${previousTabName}`,
            );
        },

        // Benchmarks (Insights generator)
        trackBenchmarksCardExpanded(metricName: string, topicName: string, gap: string) {
            track("sidebar benchmarks", "expand", `${metricName}/${topicName}/${gap}`);
        },
        trackBenchmarksEmailMeClicked(
            metricName: string,
            topicName: string,
            visualisation: BenchmarksVisualizationType,
        ) {
            track("sidebar benchmarks", "email me", `${metricName}/${topicName}/${visualisation}`);
        },
        trackBenchmarksAccReviewClicked(topicName: string) {
            track("sidebar benchmarks", "internal link", `full account review/${topicName}`);
        },
        trackBenchmarksModeChanged(modeName: string, topicName: string) {
            track("sidebar benchmarks", "change mode", `${modeName}/${topicName}`);
        },
        trackBenchmarksCategoryChanged(category: string, topicName: string) {
            track("sidebar benchmarks", "change switch tab", `${category}/${topicName}`);
        },

        // About
        trackAboutViewAllOpportunitiesClicked(metricName: string, topicName: string) {
            track(
                "sidebar top opportunity",
                "internal link",
                `view all opportunities/${topicName}/${metricName}`,
            );
        },
        trackAboutAccReviewClicked(topicName: string) {
            track("sidebar about", "internal link", `full account review/${topicName}`);
        },
        trackAboutViewTrendsClicked(topicName: string) {
            track("sidebar site info", "internal link", `view site trends/${topicName}`);
        },
        trackAboutTopCountriesTabChanged(tab: string, topicName: string) {
            track("sidebar top countries", "change tab", `${tab}/${topicName}`);
        },

        // Site trends
        trackSiteTrendsCountriesDDOpened(topicName: string) {
            track("sidebar site trends", "open", `open countries/${topicName}`);
        },
        trackSiteTrendsCountrySelected(countryName: string, topicName: string) {
            track("sidebar site trends", "change", `change country/${topicName}/${countryName}`);
        },
        trackSiteTrendsExportClicked(countryName: string, topicName: string) {
            track("sidebar site trends", "export", `${countryName}/${topicName}`);
        },
    };
};

export default createRightSidebarTrackingService;
