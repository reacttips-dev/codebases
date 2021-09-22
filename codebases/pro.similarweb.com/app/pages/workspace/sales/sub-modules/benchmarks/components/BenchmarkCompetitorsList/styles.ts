import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledBenchmarkSummaryLabel } from "../BenchmarkSummary/styles";
import { BenchmarksVisualizationType } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { StyledAddWebsiteButton } from "../EditableCompetitor/styles";

const COMPETITORS_LIST_PADDING_TOP = {
    [BenchmarksVisualizationType.TABLE]: 45,
    [BenchmarksVisualizationType.CHART]: 8,
};

const PROSPECT_ITEM_MARGIN_BOTTOM = {
    [BenchmarksVisualizationType.TABLE]: 8,
    [BenchmarksVisualizationType.CHART]: 14,
};

const ADD_WEBSITE_ITEM_MARGIN_BOTTOM = {
    [BenchmarksVisualizationType.TABLE]: 12,
    [BenchmarksVisualizationType.CHART]: 17,
};

export const StyledCompetitorItem = styled(FlexRow)`
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    span {
        color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
        font-size: 14px;
        line-height: 15px;
    }

    ${StyledBenchmarkSummaryLabel} {
        margin-right: 10px;
    }
`;

export const StyledProspectItem = styled.div`
    display: flex;
`;

export const StyledCompetitorsList = styled.div<{
    selectedVisualization: BenchmarksVisualizationType;
}>`
    flex-grow: 1;
    flex-shrink: 0;
    padding-top: ${({ selectedVisualization }) =>
        COMPETITORS_LIST_PADDING_TOP[selectedVisualization]}px;

    ${StyledProspectItem} {
        margin-bottom: ${({ selectedVisualization }) =>
            PROSPECT_ITEM_MARGIN_BOTTOM[selectedVisualization]}px;
    }

    ${StyledAddWebsiteButton} {
        margin-bottom: ${({ selectedVisualization }) =>
            ADD_WEBSITE_ITEM_MARGIN_BOTTOM[selectedVisualization]}px;
    }
`;
