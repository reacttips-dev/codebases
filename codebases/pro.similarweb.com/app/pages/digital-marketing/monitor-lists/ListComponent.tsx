import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { NoData } from "components/NoData/src/NoData";
import { i18nFilter } from "filters/ngFilters";
import {
    ListContentWrapper,
    ListFooterWrapper,
    ListHeaderWrapper,
    ListWrapper,
} from "pages/digital-marketing/monitor-lists/StyledComponents";
import { TableLoader } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import React, { FC, ReactNode } from "react";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { Button } from "@similarweb/ui-components/dist/button/src/Button";

const i18n = i18nFilter();

interface IListComponentProps {
    innerTableComponent: ReactNode;
    headerActionComponent: ReactNode;
    tableData: any;
    title: ReactNode;
    list: any;
    subtitleFilters: any;
    isLoading: boolean;
    wrapperClassName: string;
    onSeeListClick: (listId: string) => () => void;
    footerText: string;
}

export const ListComponent: FC<IListComponentProps> = ({
    innerTableComponent,
    list,
    title,
    footerText,
    subtitleFilters,
    headerActionComponent,
    isLoading,
    tableData,
    onSeeListClick,
    wrapperClassName,
}) => {
    return (
        <ListWrapper height={"277px"} className={wrapperClassName}>
            <ListHeaderWrapper justifyContent={"space-between"}>
                <FlexColumn>
                    <PrimaryBoxTitle>{title}</PrimaryBoxTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </FlexColumn>
                {headerActionComponent}
            </ListHeaderWrapper>
            <ListContentWrapper>
                {isLoading ? (
                    <TableLoader rowsAmount={3} columnsAmount={3} />
                ) : !!tableData ? (
                    innerTableComponent
                ) : (
                    <NoData
                        title={i18n("monitorLists.table.noData.title")}
                        subtitle={i18n("monitorLists.table.noData.subtitle")}
                        iconName={"no-data"}
                    />
                )}
            </ListContentWrapper>
            <ListFooterWrapper justifyContent={"flex-end"} alignItems={"center"}>
                <Button type={"flat"} onClick={onSeeListClick(list)} label={i18n(footerText)} />
            </ListFooterWrapper>
        </ListWrapper>
    );
};
