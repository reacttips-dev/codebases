import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes, rgba } from "@similarweb/styles";

const EmptyStateTitle = styled.div`
    ${setFont({ $size: "16px", $color: colorsPalettes.carbon[500] })};
    margin-top: 10px;
`;

const EmptyStateSubTitle = styled.div`
    ${setFont({ $size: "12px", $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    text-align: center;
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
`;

const EmptyStateIcon = styled(SWReactIcons)`
    svg {
        width: 160px;
        height: 99px;
    }
`;

export const EmptyState = ({ titleKey, subTitleKey }) => {
    const i18n = i18nFilter();
    return (
        <EmptyStateContainer>
            <EmptyStateIcon iconName={"no-data-lab"} />
            <EmptyStateTitle>{i18n(titleKey)}</EmptyStateTitle>
            <EmptyStateSubTitle>{i18n(subTitleKey)}</EmptyStateSubTitle>
        </EmptyStateContainer>
    );
};
