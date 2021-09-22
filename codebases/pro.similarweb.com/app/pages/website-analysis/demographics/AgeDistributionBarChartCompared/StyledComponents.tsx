import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { colorsPalettes } from "@similarweb/styles";

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 0px 24px 9px 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    margin-bottom: 20px;
`;

export const StyledHeaderTitle = styled(Title)`
    ${InfoIcon} {
        line-height: unset;
    }
`;

export const ChartContainer: any = styled.div`
    box-sizing: border-box;
    padding-top: 15px;
    width: 100%;
    height: 360px;
`;

export const ChartAndLegendsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const ChartWrapper = styled.div`
    flex: auto;
    overflow: hidden;
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
`;
