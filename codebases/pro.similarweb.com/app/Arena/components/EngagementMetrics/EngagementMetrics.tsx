import * as _ from "lodash";
import React, { Component } from "react";

import { Button } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { StyledHeaderNoBorder } from "../../../../.pro-features/pages/app performance/src/page/StyledComponents";
import { PrimaryBoxTitle } from "../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { SWReactTableOptimized } from "../../../components/React/Table/SWReactTableOptimized";
import { i18nFilter } from "../../../filters/ngFilters";
import { IEngagementTableData } from "../../../services/arena/utils";
import { BoxFooter, StyledBox, TableWrapper } from "../../StyledComponents";
import { CombinedSourceSubtitleItem } from "./CombinedSourceSubtitleItem";
import { EngagementBoxSubtitle } from "./StyledComponents";
import { DATA_KEY, DESKTOP_COLOR, getColumns, MOBILE_COLOR } from "./tableUtils";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export interface IEngagementMetricsProps {
    filters?: any;
    tableData: IEngagementTableData;
    isLoading: boolean;
    country: number;
    getCountryById: any;
}

export interface IEngagementMetricsState {
    sortedColumn: {
        field?: string;
        direction?: string;
    };
}

export interface IEngagementParams {
    country: number;
    webSource: string;
    keys: string[];
    from: string;
    to: string;
}

export default class EngagementMetrics extends Component<IEngagementMetricsProps, any> {
    private readonly swNavigator: any;

    constructor(props) {
        super(props);

        this.state = {
            sortedColumn: {},
            isMobileVisible: true,
            isDesktopVisible: true,
        };

        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
    }

    public render() {
        const { filters, tableData, isLoading, country, getCountryById } = this.props;
        const { sortedColumn } = this.state;
        const tableOptions = {
            metric: "MarketingWorkspaceEngagementMetricsTable",
            customTableClass: "SWReactTable_CellSize_l",
        };
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from: filters.from,
                    to: filters.to,
                },
            },
            {
                filter: "country",
                countryCode: country,
                value: getCountryById(country).text,
            },
            {
                value: (
                    <CombinedSourceSubtitleItem
                        onMobileToggle={() =>
                            this.setState({ isMobileVisible: !this.state.isMobileVisible })
                        }
                        onDesktopToggle={() =>
                            this.setState({ isDesktopVisible: !this.state.isDesktopVisible })
                        }
                        isMobileVisible={this.state.isMobileVisible}
                        isDesktopVisible={this.state.isDesktopVisible}
                        toggle={this.props.filters.webSource === "Total"}
                    />
                ),
            },
        ];
        const learnMoreLink = this.swNavigator.href("websites-audienceOverview", {
            ...filters,
            key: filters.keys,
        });

        const data = _.get<IEngagementTableData, "Data", any>(tableData, "Data", []);
        let sortedData = data.map((item) => {
            return {
                ...item,
                country: filters.country,
                duration: filters.duration,
                webSource: filters.webSource,
                includeSubDomains: filters.includeSubDomains,
            };
        });
        if (
            !isLoading &&
            sortedData.length > 0 &&
            filters.webSource !== devicesTypes.TOTAL &&
            Object.keys(sortedColumn).length > 0
        ) {
            // extract group average to avoid sorting with it
            const groupAverage = sortedData.find((item) => !item.domain);
            const sortField =
                sortedColumn.field === "domain"
                    ? sortedColumn.field
                    : `${sortedColumn.field}.${DATA_KEY[filters.webSource]}`;

            sortedData = _.orderBy(
                sortedData.filter((item) => item.domain),
                sortField,
                sortedColumn.sortDirection,
            );
            sortedData.push(groupAverage);
        }

        const websource = this.getWebsource();

        return (
            <StyledBox
                data-sw-intercom-tour-workspaces-marketing-engagement_metrics-styled_box-step-5
            >
                <StyledHeaderNoBorder>
                    <PrimaryBoxTitle tooltip={i18nFilter()("arena.strategic.engagement.tooltip")}>
                        {i18nFilter()("arena.strategic.engagement.title")}
                    </PrimaryBoxTitle>
                    <EngagementBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </EngagementBoxSubtitle>
                </StyledHeaderNoBorder>
                <TableWrapper isLoading={isLoading}>
                    <SWReactTableOptimized
                        type={"regular"}
                        key={websource}
                        isLoading={isLoading}
                        onSort={this.onSort}
                        tableData={{ Data: sortedData }}
                        tableColumns={getColumns(
                            websource,
                            sortedColumn,
                            _.get(tableData, "maxValues", {}),
                        )}
                        tableOptions={tableOptions}
                    />
                </TableWrapper>
                <BoxFooter>
                    <a href={learnMoreLink}>
                        <Button type="flat">
                            {i18nFilter()("workspace.arena.engagement_metrics.learn_more.button")}
                        </Button>
                    </a>
                </BoxFooter>
            </StyledBox>
        );
    }

    private onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                field,
                sortDirection,
            },
        });
    };

    private getWebsource = () => {
        if (this.props.filters.webSource === "Total") {
            const { isMobileVisible, isDesktopVisible } = this.state;
            if (isMobileVisible && !isDesktopVisible) {
                return "MobileWeb";
            }
            if (isDesktopVisible && !isMobileVisible) {
                return "Desktop";
            }
        }
        return this.props.filters.webSource;
    };
}
