import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { StyledBox } from "Arena/StyledComponents";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { RowLoadingContainer } from "components/Workspace/MarketingMixTable/src/MarketingMixTableStyled";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { FunctionComponent } from "react";
import { WrapperContainer } from "../shared/styledComponents";
import { ITableWithAlertBoxData, TableWithAlertStatelessBox } from "./TableWithAlertStatelessBox";

export interface ITableWithAlertBoxWrapper {
    isLoading: boolean;
    error?: any;
    data?: ITableWithAlertBoxData;
    noDataTitle?: string;
    noDataSubtitle?: string;
}

export const TableWithAlertBoxWrapper: FunctionComponent<ITableWithAlertBoxWrapper> = ({
    isLoading,
    data,
    error,
    noDataTitle,
    noDataSubtitle,
}) => {
    const width = "100%";
    return (
        <StyledBox>
            {!isLoading && data && !error && (
                <TableWithAlertStatelessBox {...{ data, noDataTitle, noDataSubtitle }} />
            )}
            {!isLoading && !data && !error && (
                <WrapperContainer>
                    <NoDataLandscape
                        title={i18nFilter()("workspaces.marketing.tablewithalertbox.nodata.title")}
                        subtitle={i18nFilter()(
                            "workspaces.marketing.tablewithalertbox.nodata.subtitle",
                        )}
                    />
                </WrapperContainer>
            )}
            {!isLoading && error && (
                <WrapperContainer>
                    <NoDataLandscape
                        title={i18nFilter()("workspaces.marketing.tablewithalertbox.error.title")}
                        subtitle={i18nFilter()(
                            "workspaces.marketing.tablewithalertbox.error.subtitle",
                        )}
                    />
                </WrapperContainer>
            )}
            {isLoading && (
                <WrapperContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={22} />
                    </RowLoadingContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={16} />
                    </RowLoadingContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={16} />
                    </RowLoadingContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={16} />
                    </RowLoadingContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={16} />
                    </RowLoadingContainer>
                    <RowLoadingContainer>
                        <PixelPlaceholderLoader width={width} height={22} />
                    </RowLoadingContainer>
                </WrapperContainer>
            )}
        </StyledBox>
    );
};
TableWithAlertBoxWrapper.displayName = "TableWithAlertBoxWrapper";
