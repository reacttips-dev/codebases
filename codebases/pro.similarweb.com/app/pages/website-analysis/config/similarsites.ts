import * as _ from "lodash";
/**
 * Created by liorb on 12/18/2016.
 */

const SimilarSites: any = {
    single: [
        {
            metric: "SimilarSites",
            type: "Table",
            properties: {
                metric: "SimilarSites",
                apiController: "WebsiteCompetitors",
                type: "Table",
                height: "auto",
                width: "12",
                options: {
                    cssClass: "widgetTable",
                    showTitle: true,
                    showTitleTooltip: true,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
                    stickyHeader: true,
                    titleTemplate:
                        "/app/components/widget/widget-templates/table-compare-title.html",
                },
            },
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomLeft",
                    },
                    utilities: [
                        {
                            id: "table-search",
                            properties: {},
                        },
                        {
                            id: "dropdown",
                            properties: {
                                param: "filter",
                                column: "category",
                                operator: "category",
                                placeholder: "All Categories",
                                showSearch: false,
                                trackingName: "category",
                                emptySelect: true,
                            },
                        },
                    ],
                },
                {
                    properties: {
                        className: "tableBottomRight",
                    },
                    utilities: [
                        {
                            id: "table-export",
                            properties: {},
                        },
                        {
                            id: "columns-toggle",
                            properties: {},
                        },
                    ],
                },
                {
                    properties: {
                        className: "tableBottom",
                    },
                    utilities: [
                        {
                            id: "table-pager",
                            properties: {},
                        },
                    ],
                },
            ],
        },
    ],
};
SimilarSites.compare = _.cloneDeep(SimilarSites.single);
SimilarSites.compare[0].properties.ignoreCompareMode = true;
SimilarSites.compare[0].utilityGroups[0].utilities.unshift({
    id: "domain-selector",
    properties: {},
});
export { SimilarSites };
