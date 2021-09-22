import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";

export const GraphContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    display: flex;
    flex-direction: column;
    border-radius: 6px 6px 0 0;
    box-shadow: 0 3px 6px 0 rgb(14 28 72 / 8%);
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
`;

export const GraphContentContainer = styled.div`
    padding: 24px;
    min-height: 482px;
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 482px;
    padding: 24px;
`;

export const GraphHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
`;

export const TitleContainer = styled.span`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[400], $weight: 500 })};
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const MTDContainer = styled.div<{ isDisabled: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
`;

export const MTDToggleContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 24px;
`;

export const MTDTitle = styled(StyledBoxSubtitle)<{ isDisabled: boolean }>`
    color: ${(props) =>
        props.isDisabled
            ? rgba(colorsPalettes.carbon[500], 0.3)
            : rgba(colorsPalettes.carbon[500], 0.8)};
`;

export const SwitchContainer = styled.div`
    margin-right: 24px;
`;

export const Switcher = styled(SwitcherGranularityContainer)`
    button {
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }
`;
