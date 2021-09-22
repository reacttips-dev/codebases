/* styled components */
import { colorsPalettes } from "@similarweb/styles";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const ActionsWrapper = styled(FlexRow)`
    align-items: center;
    position: absolute;
    right: 16px;
    top: 16px;
`;

export const Container = styled(FlexColumn)`
    height: 100%;
`;

export const GraphContainer = styled.div`
    flex-grow: 1;
`;

export const SwitcherGranularity = styled(SwitcherGranularityContainer)`
    button {
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }
`;

export const MonthToDateToggleContainer = styled.div`
    align-self: center;
    padding: 0px 20px;
`;

export const ComponentsContainer = styled.div`
    padding: 16px 16px 0px 16px;
`;

export const ComponentsDelimiter = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    margin: 15px 0px;
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 550px;
`;
