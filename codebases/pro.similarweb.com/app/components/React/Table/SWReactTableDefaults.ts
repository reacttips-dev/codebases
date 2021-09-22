import * as _ from "lodash";
import { i18nFilter } from "filters/ngFilters";

export const TABLE_CONFIG = {
    pageSize: 100,
    loadingSize: 20,
    sortDirection: "DESC",
    childRowLimit: 5,
    CHILDS_BUNCH: 5, // Num of childs to show with each "show more" click
    cellTemplatePath: "/app/components/table/templates/",
    simpleTableType: "swTable--simple",
};

export function column(config) {
    return {
        field: config.field || "DaysSinceInstall",
        subField: config.subField,
        displayName: i18nFilter()(config.displayName) || "",
        cellTemplate:
            TABLE_CONFIG.cellTemplatePath + (config.cellTemplate || "default-cell") + ".html",
        cellComponent: config.cellComponent,
        headerCellTemplate:
            TABLE_CONFIG.cellTemplatePath +
            (config.headerCellTemplate || "default-cell-header") +
            ".html",
        headerComponent: config.headerComponent,
        disableHeaderCellHover: config.disableHeaderCellHover || false,
        columnClass: config.columnClass,
        sortable: config.sortable || false,
        sortDirection: config.sortDirection || TABLE_CONFIG.sortDirection,
        isSorted: config.isSorted || false,
        width: config.width,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        groupable: config.groupable || false,
        tooltip: config.tooltip || false, // tooltip text, displayed with an infoIcon
        progressBarTooltip: config.progressBarTooltip || "", // tooltip displayed on the progress bar
        showTotalCount: config.showTotalCount || false, // shows totalCount of records
        format: config.format || "", // used for filter on cell template
        headerCellIcon: config.headerCellIcon, // to use font-icons, should be deprecated
        headerCellIconName: config.headerCellIconName, // to use SWReactIcons
        inverted: config.inverted,
        fields: config.fields,
        hideHeader: config.hideHeader,
        cellClass: config.cellClass,
        headerCellClass: config.headerCellClass,
        visible: config.visible || true,
        toggleable: true,
        category: config.category || "",
        fixed: config.fixed || false,
        trackingName: config.trackingName,
        dangerouslySetInnerHTML: config.dangerouslySetInnerHTML,
        renderTextInsteadOfLinks: config.renderTextInsteadOfLinks,
        isLegendItem: config.isLegendItem,
        actions: config.actions,
        isResizable: config.isResizable,
    };
}

export function options(options) {
    return {
        showIndex: options.showIndex,
        downloadUrl: options.downloadUrl || false,
        showLoadMore: options.showLoadMore || false,
        filterField: options.filterField || false,
        tableType: options.tableType || "",
        loadingSize: options.loadingSize || TABLE_CONFIG.loadingSize,
        dataErrorMessageTop: options.dataErrorMessageTop || "appstorekeywords.topkeywords.nodata",
        dataErrorMessageBottom: options.dataErrorMessageBottom || "",
        hideHeader: options.hideHeader || false,
        colorSource: options.colorSource || "main",
        hideBorders: options.hideBorders || false,
        hideRowsBorders: options.hideRowsBorders || false,
        trackName: options.trackName || "",
        stickyHeader: options.stickyHeader || false,
        scrollableTable: options.scrollableTable || false,
        showCompanySidebar: options.showCompanySidebar || false,
        // when true, sorted column with fixed width get extra 15 pixels
        sortedColumnAddedWidth: options.sortedColumnAddedWidth || false,
        onSort: _.isFunction(options.onSort) && options.onSort,
        enableRowSelection: options.enableRowSelection || false,
        numberOfFixedColumns: options.numberOfFixedColumns || 1,
        tableSelectionTrackingParam: options.tableSelectionTrackingParam || "",
        overrideIndexColumnWidth: options.overrideIndexColumnWidth,
        metric: options.metric || false,
        customTableClass: options.customTableClass,
        colors: options.colors,
        shouldEnrichRow: options.shouldEnrichRow,
        aboveHeaderComponents: options.aboveHeaderComponents,
        EnrichedRowComponent: options.EnrichedRowComponent,
        enrichedRowComponentHeight: options.enrichedRowComponentHeight,
        enrichedRowComponentTimeout: options.enrichedRowComponentTimeout,
        renderTextInsteadOfLinks: options.renderTextInsteadOfLinks,
        isFiltersSupported: options.isFiltersSupported,
        onEnrichedRowClick: options.onEnrichedRowClick,
        rowActionsComponents: options.rowActionsComponents,
    };
}
