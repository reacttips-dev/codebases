import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { setFont } from "@similarweb/styles/src/mixins";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const InfoContainer = styled.span`
    margin-top: 9px;
    margin-left: 3px;
`;

export const BenchmarkValuesContainer = styled.div`
    margin: 15px;
    margin-top: 0;
    display: flex;
    margin-left: 47px;
`;

export const Text = styled.label<{ marginRight?: string }>`
    display: inline-block;
    margin-right: 6px;
    overflow: hidden;
    margin-top: auto;
    margin-bottom: auto;
    white-space: nowrap;
    cursor: inherit;
    width: fit-content;
    ${setFont({ $size: 13, $color: rgba(colorsPalettes.carbon[500], 0.8) })}
`;
export const ConversionScatterChartContainer = styled.span<{ cursorUrl: string }>`
    &:hover {
        cursor: url(${({ cursorUrl }) => cursorUrl}), zoom-in;
    }
    .highcharts-axis-labels {
        cursor: default;
    }
`;

export const FlexBoxSpaceBetween = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    margin: 15px;
    @media print {
        margin: 0px;
    }
`;

export const BenchmarkContainer = styled(FlexRow)`
    @media print {
        display: none;
    }
`;

export const FiltersContainer = styled.div`
    @media print {
        display: none;
    }
`;

export const Vs = styled.span`
    margin: auto 10px;
    ${setFont({ $size: 14, weight: 400, $color: colorsPalettes.carbon["500"] })};
`;

export const BenchMarkCheckbox = styled(Checkbox)`
    cursor: pointer;
`;
