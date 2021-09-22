import { NoData, NoDataIcon, NoDataTitle } from "components/NoData/src/NoData";
import React from "react";
import styled from "styled-components";

const NoDataStyled = styled(NoData)`
    ${NoDataIcon} {
        width: auto;
        height: auto;
    }
    ${NoDataTitle} {
        margin-bottom: 6px;
    }
`;

export const GraphNoData = ({ title, subtitle, iconName }) => {
    return <NoDataStyled title={title} subtitle={subtitle} iconName={iconName} />;
};
