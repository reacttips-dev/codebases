import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes } from "@similarweb/styles";
import Chart from "../../../../../.pro-features/components/Chart/src/Chart";

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 15px 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    margin-bottom: 20px;
`;

export const StyledHeaderTitle = styled(Title)`
    ${InfoIcon} {
        line-height: unset;
    }
`;

export const GenderChartContainer = styled(FlexColumn)`
    width: 100%;
    height: 100%;
`;

export const StyledChart = styled(Chart)`
    padding: 0px 24px;
`;

export const LegendContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-family: "Roboto";
`;

export const LabelName = styled.span`
    font-size: 14px;
    font-weight: 300;
    color: ${colorsPalettes.carbon[500]};
    margin-bottom: 4px;
`;

export const LabelValue = styled.span`
    font-size: 24px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
`;
