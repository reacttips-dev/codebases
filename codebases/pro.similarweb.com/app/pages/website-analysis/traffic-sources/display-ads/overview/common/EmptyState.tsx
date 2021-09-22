import { i18nFilter } from "filters/ngFilters";
import React, { FC } from "react";
import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { CenteredFlexColumn } from "styled components/StyledFlex/src/StyledFlex";

const EmptyStateTitle = styled.div<{ isSmallWidget }>`
    color: ${colorsPalettes.carbon[500]};
    font-size: 16px;
    color: ${({ isSmallWidget }) =>
        isSmallWidget ? rgba(colorsPalettes.carbon[500], 0.6) : colorsPalettes.carbon[500]};
    ${({ isSmallWidget }) =>
        !isSmallWidget &&
        css`
            margin-top: 10px;
        `}
`;

const EmptyStateSubTitle = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    font-size: 12px;
    text-align: center;
`;

const EmptyStateContainer = styled(CenteredFlexColumn)`
    height: 100%;
`;

const EmptyStateIcon = styled(SWReactIcons)`
    svg {
        width: ${({ isSmallWidget }) => (isSmallWidget ? "100px" : "160px")};
        height: ${({ isSmallWidget }) => (isSmallWidget ? "40px" : "99px")};
    }
`;

interface IEmptyStateProps {
    titleKey: string;
    subTitleKey: string;
    isSmallWidget?: boolean;
}

export const EmptyState: FC<IEmptyStateProps> = (props: IEmptyStateProps) => {
    const { titleKey, subTitleKey, isSmallWidget } = props;
    const i18n = i18nFilter();
    return (
        <EmptyStateContainer>
            <EmptyStateIcon iconName="no-data-lab" isSmallWidget={isSmallWidget} />
            <EmptyStateTitle isSmallWidget={isSmallWidget}>{i18n(titleKey)}</EmptyStateTitle>
            {!isSmallWidget && <EmptyStateSubTitle>{i18n(subTitleKey)}</EmptyStateSubTitle>}
        </EmptyStateContainer>
    );
};
