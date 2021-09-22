import { useMemo, useCallback } from "react";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { IndexCell, TrafficShare } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { allTrackers } from "../../../services/track/track";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const domainCellComponent = ({ value, row }) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const internalLink = useMemo(() => {
        return swNavigator.href("websites-worldwideOverview", {
            key: value,
            country: 840,
            duration: "3m",
            webSource: "Total",
            isWWW: "*",
        });
    }, [value]);

    const trackInternalLink = useCallback(() => {
        return (e) => {
            e.stopPropagation();
            allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
        };
    }, []);

    const trackExternalLink = useCallback(() => {
        return (e) => {
            e.stopPropagation();
            allTrackers.trackEvent("External Link", "click", `Table/${value}`);
        };
    }, []);

    return (
        <ComponentsProvider components={{ WebsiteTooltip }}>
            <CoreWebsiteCell
                displayName="CoreWebsiteCell"
                domain={value}
                icon={row.Favicon}
                internalLink={internalLink}
                trackInternalLink={trackInternalLink}
                trackExternalLink={trackExternalLink}
                hideTrackButton={true}
                externalLink={`http://${value}`}
            />
        </ComponentsProvider>
    );
};

export const SubdomainsTableColumnsSingleConfig = [
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 65,
        visible: true,
    },
    {
        field: "Domain",
        displayName: "Domain",
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: domainCellComponent,
        headerComponent: DefaultCellHeader,
        totalCount: true,
        tooltip: i18nFilter()("analysis.content.sub.table.columns.domain.title.tooltip"),
        width: 500,
        visible: true,
    },
    {
        field: "Share",
        displayName: "Traffic Share",
        type: "string",
        format: "percentagesign",
        sortable: true,
        isSorted: true,
        sortDirection: "desc",
        groupable: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeader,
        totalCount: false,
        tooltip: i18nFilter()("analysis.content.sub.table.columns.share.title.tooltip"),
        width: 300,
        visible: true,
    },
];

export const SubdomainsTableColumnsCompareConfig = [
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 65,
        visible: true,
    },
    {
        field: "Domain",
        displayName: "Domain",
        type: "string",
        format: "None",
        sortable: "true",
        isSorted: "false",
        sortDirection: "desc",
        groupable: "false",
        cellComponent: domainCellComponent,
        headerComponent: DefaultCellHeader,
        totalCount: "true",
        tooltip: i18nFilter()("analysis.content.sub.table.columns.domain.title.tooltip"),
        width: 500,
        visible: true,
    },
    {
        field: "Share",
        displayName: "Traffic Share",
        type: "string",
        format: "percentagesign",
        sortable: "true",
        isSorted: "true",
        sortDirection: "desc",
        groupable: "false",
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeader,
        totalCount: "False",
        tooltip: i18nFilter()("analysis.content.sub.table.columns.share.title.tooltip"),
        width: 300,
        visible: true,
    },
];

export const SubdomainsTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    isCompare: boolean,
) => {
    if (isCompare) {
        return SubdomainsTableColumnsCompareConfig.map((col, idx) => {
            if (!col.sortable) {
                return col;
            }
            return {
                ...col,
                isSorted: col.field === sortbyField,
                sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
            };
        });
    }
    return SubdomainsTableColumnsSingleConfig.map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: col.field === sortbyField,
            sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};
