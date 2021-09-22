import React from "react";
import selectionColumn from "pages/sales-intelligence/pages/find-leads/components/TableSelection/selection-column";
import {
    AdsenseCell,
    ChangePercentage,
    IndexCell,
    RankCell,
    ReferringCategorySimpleCell,
    TrafficShareWithVisits,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { Column } from "components/widget/widget-config/metrics/@types/IColumn";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { AddWebsitesBubble } from "pages/lead-generator/lead-generator-wizard/components/AddWebsitesBubble";

// TODO: Add correct translation keys (SI related)
export const getTableColumns = (translate: (key: string) => string) => {
    return [
        {
            fixed: true,
            width: 48,
            cellComponent: (props) => (
                <div className="u-alignCenter">
                    <RowSelectionConsumer {...props} />
                    {props.row.index === 0 && <AddWebsitesBubble />}
                </div>
            ),
            headerComponent: () => null,
            visible: true,
            sortable: false,
        },
        {
            minWidth: 224,
            isResizable: true,
            sortable: true,
            field: "Domain",
            title: "Domain",
            showTotalCount: true,
            displayName: translate("Websites"),
            tooltip: translate("analysis.source.referrals.table.columns.domain.title.tooltip"),
            cellComponent: WebsiteTooltipTopCell,
            visible: true,
            sortDirection: "desc",
        },
        {
            minWidth: 240,
            isResizable: true,
            sortable: true,
            field: "Category",
            title: "Category",
            displayName: translate("analysis.source.referrals.table.columns.category.title"),
            tooltip: translate("analysis.source.referrals.table.columns.category.title.tooltip"),
            cellComponent: ReferringCategorySimpleCell,
            visible: true,
            sortDirection: "desc",
        },
        {
            minWidth: 104,
            isResizable: true,
            sortable: true,
            field: "Rank",
            title: "Rank",
            displayName: translate("analysis.source.referrals.table.columns.rank.title"),
            tooltip: translate("analysis.source.referrals.table.columns.rank.title.tooltip"),
            cellComponent: RankCell,
            visible: true,
            sortDirection: "desc",
        },
        {
            minWidth: 138,
            isResizable: true,
            sortable: true,
            field: "Share",
            title: "Share",
            displayName: translate("analysis.source.referrals.table.columns.share.title"),
            tooltip: translate("analysis.source.referrals.table.columns.share.title.tooltip"),
            cellComponent(props: any) {
                return <TrafficShareWithVisits {...props} applyAbbrNumberFilter={true} />;
            },
            visible: true,
            sortDirection: "desc",
        },
        {
            minWidth: 108,
            isResizable: true,
            sortable: true,
            field: "Change",
            title: "Change",
            displayName: translate("analysis.source.search.all.table.columns.change.title"),
            cellComponent: ChangePercentage,
            visible: true,
            sortDirection: "desc",
        },
        {
            width: 77,
            sortable: true,
            field: "HasAdsense",
            title: "HasAdsense",
            displayName: translate("analysis.all.table.columns.googleads.title"),
            tooltip: translate("analysis.all.table.columns.googleads.title.tooltip"),
            cellComponent: AdsenseCell,
            visible: true,
            sortDirection: "desc",
        },
    ] as Column[];
};
