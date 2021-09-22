import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const StyledHeader: any = styled(FlexColumn)`
    height: 70px;
    padding-top: 24px;
    padding-left: 24px;
`;
StyledHeader.displayName = "StyledHeader";
export const FiltersContainer = styled(FlexRow)`
    justify-content: space-between;
    padding: 16px 24px;
`;
FiltersContainer.displayName = "FiltersContainer";

export const CheckboxesContainer = styled(FlexRow)`
    grid-column: 1;
`;
CheckboxesContainer.displayName = "CheckboxesContainer";

export const ChartContainer = styled.div`
    box-sizing: border-box;
    padding: 0 14px 8px 14px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;
ChartContainer.displayName = "ChartContainer";
export const StyledBox = styled(Box)`
    width: 100%;
    height: 554px;
`;
export const CheckboxContainer = styled.div`
    margin-right: 16px;
`;
CheckboxContainer.displayName = "CheckboxContainer";
export const ButtonsContainer = styled.div`
    display: flex;
`;
ButtonsContainer.displayName = "ButtonsContainer";
