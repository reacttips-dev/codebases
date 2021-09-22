import { Button } from "@similarweb/ui-components/dist/button";
import { WidgetAlert } from "@similarweb/ui-components/dist/WidgetAlert";
import React, { FunctionComponent } from "react";
import BoxSubtitle from "../../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { StyledHeaderNoBorder } from "../../../../../.pro-features/pages/app performance/src/page/StyledComponents";
import StyledBoxSubtitle from "../../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { PrimaryBoxTitle } from "../../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { BoxFooter, TableWrapper } from "../../../../Arena/StyledComponents";
import { SWReactTableOptimized } from "../../../../components/React/Table/SWReactTableOptimized";
import {
    BoxAlertContainer,
    BoxMetricWrapper,
    BoxTableTitle,
    MarketingWorkspaceOverviewKWTableLegend,
} from "../shared/styledComponents";

export interface ITableWithAlertStatelessBoxProps {
    data: ITableWithAlertBoxData;
    noDataTitle?: string;
    noDataSubtitle?: string;
}

export interface ITableWithAlertBoxData {
    boxTitle: string;
    boxTitleTooltip: string;
    subtitleFilters: any[];
    alertLink: string;
    alertContent: JSX.Element;
    tableTitle: string;
    tableData: any;
    tableColumn: any;
    buttonLink: string;
    buttonText: string;
    sitesForLegend: any;
    isPdf: boolean;
    onAlertClick?: VoidFunction;
    onFooterLinkClick?: VoidFunction;
}

export const TableWithAlertStatelessBox: FunctionComponent<ITableWithAlertStatelessBoxProps> = ({
    data: {
        subtitleFilters,
        tableColumn,
        tableData,
        alertContent,
        alertLink,
        boxTitle,
        boxTitleTooltip,
        tableTitle,
        buttonLink,
        buttonText,
        sitesForLegend,
        isPdf,
        onAlertClick = () => null,
        onFooterLinkClick = () => null,
    },
    noDataTitle,
    noDataSubtitle,
}) => {
    const onLinkClickProxy = (href, cb) => () => {
        cb();
        window.location.href = href;
    };

    return (
        <>
            <StyledHeaderNoBorder>
                <PrimaryBoxTitle tooltip={boxTitleTooltip}>{boxTitle}</PrimaryBoxTitle>
                <StyledBoxSubtitle>
                    <BoxSubtitle filters={subtitleFilters} />
                </StyledBoxSubtitle>
                {isPdf && <MarketingWorkspaceOverviewKWTableLegend sites={sitesForLegend} />}
            </StyledHeaderNoBorder>
            {tableData.Data.length > 0 && (
                <BoxAlertContainer>
                    <WidgetAlert onClick={onLinkClickProxy(alertLink, onAlertClick)}>
                        {alertContent}
                    </WidgetAlert>
                </BoxAlertContainer>
            )}
            <BoxMetricWrapper>
                {tableData.Data.length > 0 && <BoxTableTitle>{tableTitle}</BoxTableTitle>}
                <TableWrapper>
                    <SWReactTableOptimized
                        type={"regular"}
                        tableData={tableData}
                        tableColumns={tableColumn}
                        tableOptions={{ noDataTitle, noDataSubtitle }}
                    />
                </TableWrapper>
            </BoxMetricWrapper>
            {tableData.Data.length > 0 && (
                <BoxFooter>
                    <a href={buttonLink}>
                        <Button type="flat" onClick={() => onFooterLinkClick()}>
                            {buttonText}
                        </Button>
                    </a>
                </BoxFooter>
            )}
        </>
    );
};
TableWithAlertStatelessBox.displayName = "TableWithAlertStatelessBox";
