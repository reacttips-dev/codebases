import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import * as _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import {
    ListCardHeaderContainer,
    ListCardSubtitle,
    ListCardTitle,
} from "../../../../.pro-features/pages/workspace/common components/OverviewPage/StyledComponents";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SWReactTableOptimized } from "../../../components/React/Table/SWReactTableOptimized";
import { i18nFilter } from "../../../filters/ngFilters";
import { ISegmentData } from "../ConversionSegmentsUtils";
import {
    ConversionLeaderboardTableColumnsConfigGen,
    ConversionLeaderboardTableOptions,
} from "./ConversionLeaderboardsTableConfig";
import CountryService from "services/CountryService";

const LOADER_ROWS_NUMBER = 6;

export interface IConversionLeaderboardTableContainerProps {
    tableData: any;
    tableHeader: string;
    tableHeaderTooltip: string;
    isLoading: boolean;
    filters: any;
    tableBaseConfig: any;
    sortedColumn?: { field: string; sortDirection?: string };
    segments?: ISegmentData;
}

export interface IConversionLeaderboardTableContainerState {
    sortedColumn: {
        field: string;
        sortDirection: string;
    };
}

class ConversionLeaderboardTableContainer extends Component<
    IConversionLeaderboardTableContainerProps,
    IConversionLeaderboardTableContainerState
> {
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: {
                field: props.sortedColumn.field ? props.sortedColumn.field : "",
                sortDirection: props.sortedColumn.sortDirection
                    ? props.sortedColumn.sortDirection
                    : "desc",
            },
        };
    }

    public onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                field,
                sortDirection,
            },
        });
    };

    public render() {
        const {
            isLoading,
            tableData,
            tableBaseConfig,
            filters,
            tableHeader,
            tableHeaderTooltip,
            segments,
        } = this.props;
        let filteredData;
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from: filters.from,
                    to: filters.to,
                },
            },
            {
                filter: "webSource",
                value: "Desktop", // values: available: 'Total' / 'Desktop'
            },
            {
                filter: "country",
                countryCode: filters.country, // values: available: any country code no.
                value: CountryService.getCountryById(filters.country).text,
            },
        ];
        const { sortedColumn } = this.state;
        if (!isLoading && tableData) {
            filteredData = _.orderBy(
                tableData,
                sortedColumn.field,
                sortedColumn.sortDirection as any,
            );
        }
        const tableProps = {
            onSort: this.onSort,
            isLoading,
            tableData: { Data: filteredData },
            loaderRowsNumber: LOADER_ROWS_NUMBER,
            tableColumns: ConversionLeaderboardTableColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
                tableBaseConfig,
                segments,
            ),
            tableOptions: {
                metric: "ConversionLeaderboardTable",
                ...ConversionLeaderboardTableOptions(),
            },
        };

        return (
            <TableWrapper loading={isLoading}>
                <ListCardHeaderContainer>
                    <ListCardTitle>
                        <BoxTitle tooltip={i18nFilter()(tableHeaderTooltip)}>
                            {i18nFilter()(tableHeader)}
                        </BoxTitle>
                    </ListCardTitle>
                    <ListCardSubtitle data-automation="data-automation-box-subtitle">
                        <BoxSubtitle filters={subtitleFilters} />
                    </ListCardSubtitle>
                </ListCardHeaderContainer>
                <SWReactTableOptimized {...tableProps} />
            </TableWrapper>
        );
    }
}
const mapStateToProps = ({ conversionModule: { segments } }) => {
    return {
        segments,
    };
};

export default connect(mapStateToProps, null)(ConversionLeaderboardTableContainer);

export const TableWrapper: any = styled(Box)<{ loading: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 530px;
    height: auto;
    border-radius: 6px;
    display: block;
    @media (max-width: 1566px) {
        margin: 0 16px 24px 0;
    }
    margin: 0 32px 24px 0;
    transition: box-shadow 0.25s;
    &:hover {
        box-shadow: 0 3px 6px ${rgba(colorsPalettes.midnight[600], 0.2)};
    }
`;
TableWrapper.displayName = "TableWrapper";
