/* eslint-disable @typescript-eslint/camelcase */
import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import { StyledItemIcon } from "../../../../.pro-features/components/core cells/src/CoreRecentCell/StyledComponents";
import { TextContainer } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/StyledComponents";
import { CountryCell, TrendCell } from "../../../components/React/Table/cells";
import { RowSelectionConsumer } from "../../../components/React/Table/cells/RowSelection";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "../../../components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    AlertsIndicatorSales,
    AlreadySeenAlertsIndicator,
    DomainNameAndIconHeaderWrapper,
    DomainNameAndIconWrapper,
    AlertsIndicator,
} from "../StyledComponent";
import { AssetsService } from "services/AssetsService";

export const selectCol = {
    fixed: true,
    isCheckBox: true,
    // eslint-disable-next-line react/display-name
    cellComponent: (props) => (
        <div className="u-alignCenter">
            <RowSelectionConsumer {...props} />
        </div>
    ),
    sortable: false,
    width: 48,
    headerComponent: SelectAllRowsHeaderCellConsumer,
    visible: true,
};

export const trendCol = {
    visible: true,
    field: "trend",
    displayName: i18nFilter()("workspaces.totalvisits.table.column.trend"),
    tooltip: i18nFilter()("workspaces.totalvisits.table.column.trend.tooltip"),
    cellComponent: TrendCell,
    headerComponent: DefaultCellHeader,
    sortable: false,
    width: 140,
    groupKey: "totalEngagement",
};

export const topGeoCountryCol = {
    visible: true,
    field: "top_geo_country",
    displayName: i18nFilter()("workspaces.totalvisits.table.column.top_geo_country"),
    tooltip: i18nFilter()("workspaces.totalvisits.table.column.top_geo_country.tooltip"),
    cellComponent: CountryCell,
    headerComponent: DefaultCellHeader,
    sortable: false,
    width: 180,
    groupKey: "totalEngagement",
    ppt: {
        // override the table column format when rendered in ppt
        overrideFormat: "Country",
    },
};

export const DomainNameAndIconHeader = (props) => (
    <DomainNameAndIconHeaderWrapper>
        <DefaultCellHeader {...props} />
        <SWReactIcons iconName="alerts" size="xs" />
    </DomainNameAndIconHeaderWrapper>
);

export type DomainNameAndIconProps = {
    icon: any;
    domain: any;
};

export const DomainNameAndIcon: React.FC<DomainNameAndIconProps> = ({ icon, domain }) => {
    return (
        <DomainNameAndIconWrapper>
            <StyledItemIcon iconName="" iconSrc={icon} />
            <TextContainer>{domain}</TextContainer>
        </DomainNameAndIconWrapper>
    );
};

export type DomainNameAndIconWithAlertsProps = {
    icon: any;
    domain: any;
    allAlerts?: number;
    unseenAlerts?: number;
};

export const DomainNameAndIconWithAlerts: React.FC<DomainNameAndIconWithAlertsProps> = ({
    icon,
    domain,
    allAlerts = 0,
    unseenAlerts = 0,
}) => {
    function renderAlertsIndicator() {
        if (unseenAlerts > 0) {
            return <AlertsIndicator visible>{unseenAlerts}</AlertsIndicator>;
        }

        if (allAlerts > 0) {
            return (
                <AlreadySeenAlertsIndicator
                    src={AssetsService.assetUrl(
                        "/images/workspace/alert-indicator/alert-indicator-seen.svg",
                    )}
                />
            );
        }

        return null;
    }

    return (
        <DomainNameAndIconWrapper>
            <StyledItemIcon iconName="" iconSrc={icon} />
            <TextContainer>{domain}</TextContainer>
            {renderAlertsIndicator()}
        </DomainNameAndIconWrapper>
    );
};

type AlertsIndicatorCellProps = {
    className?: string;
    row: {
        number_of_all_alerts: number;
        number_of_unseen_alerts: number;
    };
};

export const AlertsIndicatorCell = ({ row, className = null }: AlertsIndicatorCellProps) => {
    let alertContainer = null;

    if (row.number_of_unseen_alerts > 0) {
        alertContainer = (
            <AlertsIndicatorSales visible>{row.number_of_unseen_alerts}</AlertsIndicatorSales>
        );
    } else if (row.number_of_all_alerts > 0) {
        alertContainer = (
            <AlertsIndicatorSales visible seen>
                {row.number_of_all_alerts}
            </AlertsIndicatorSales>
        );
    }

    return <div className={className}>{alertContainer}</div>;
};

export const visibleColumnsFromConfig = {
    company_country: true,
    visits: true,
    monthly_visits_change_mom: true,
    monthly_visits_change_yoy: true,
    top_geo_country: true,
    trend: true,
    organic_search_desktop_visits: true,
    organic_search_visits_change_mom: true,
};
