import { TrafficShare } from "components/React/Table/cells/TrafficShare";
import { abbrNumberFilter, minAbbrNumberFilter } from "filters/ngFilters";
import React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

const TotalVisitsContainer = styled.div<{ layout: string }>`
    text-align: ${({ layout }) => (layout === "row" ? "left" : "right")};
    min-width: ${({ layout }) => (layout === "row" ? "30px" : "50px")};
`;

const TrafficShareContainer = styled.div<{ layout: string }>`
    margin-left: ${({ layout }) => (layout === "row" ? "20px" : "24px")};
    ${({ layout }) =>
        layout === "row" &&
        css`
            width: 80%;
        `};

    .min-value {
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export const TrafficShareWithVisits = (props) => {
    const layout = props.layout ? props.layout : "column";
    const trafficShareHeight = layout === "column" ? 4 : 8;
    const applyAbbrNumberFilter = props.applyAbbrNumberFilter ? props.applyAbbrNumberFilter : false;
    let totalVisits = applyAbbrNumberFilter
        ? minAbbrNumberFilter()(props.row.TotalVisits)
        : abbrNumberFilter()(props.row.TotalVisits);

    // SIM-29655
    if (!applyAbbrNumberFilter && props.value < 0.0001) {
        totalVisits = "-";
    }
    return (
        <FlexRow justifyContent="flex-start" alignItems="center">
            <TotalVisitsContainer layout={layout}>{totalVisits}</TotalVisitsContainer>
            <TrafficShareContainer layout={layout}>
                <TrafficShare {...props} layout={layout} height={trafficShareHeight} />
            </TrafficShareContainer>
        </FlexRow>
    );
};

TrafficShareWithVisits.displayName = "TrafficShareWithVisits";
