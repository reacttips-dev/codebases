import { constants } from "components/React/MarketingChannelsDistribution/constants";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

export const ChartContainer = styled.div`
    height: 52px;
    width: 90px;
    padding-bottom: 8px;
`;

export const ChartContainerCompare = styled(ChartContainer)<{ width: number }>`
    ${({ width }) => `width:${width}px`}
`;

const parseConfigToCss = (config) => {
    const SPACE = " ";
    const DASH = "-";
    const TRANSITION_TIME = "120ms";
    const configEntries = Object.entries(config);
    const results = configEntries.map((entry: any) => {
        return `
            .${entry[1].API_RESULTS_NAME.replace(SPACE, DASH)} {
                transition: fill ${TRANSITION_TIME};
                fill: ${entry[1].COLOR};
            }
        `;
    });
    return results.join(SPACE);
};

export const ChartContainerSingle = styled(ChartContainer)`
    &:hover {
        ${parseConfigToCss(constants)}
    }
`;

export const Circle = styled.span<{ color: string }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    ${({ color }) => `background-color:${color};`};
`;

export const CircleContainer = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const ChartTooltipRowContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ChartTooltipContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 6px 6px 0 ${colorsPalettes.carbon[200]};
    border-radius: 6px;
    width: 200px;
    padding: 10px;
`;

export const Text = styled.span<{ isBold?: boolean }>`
    align-self: center;
    ${({ isBold = false }) => `
    ${setFont({
        $size: 14,
        $weight: isBold ? 700 : 400,
        $color: rgba(colorsPalettes.carbon[500], 0.7),
    })};
  `};
`;

export const ShortText = styled(Text)`
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    max-width: 130px;
`;

export const IconContainer = styled.span`
    padding-left: 6px;
    svg {
        width: 12px;
        height: 12px;
    }
`;

export const MarketingChannelsDistributionContainer = styled.div`
    display: flex;
`;
