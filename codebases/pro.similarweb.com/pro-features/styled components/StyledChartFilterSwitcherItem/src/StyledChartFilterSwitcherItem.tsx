import { colorsPalettes } from "@similarweb/styles";
import { TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const StyledChartFilterSwitcherItem = styled(TextSwitcherItem)`
    width: 40px;
    font-size: 17px;
    &.selected {
        color: ${colorsPalettes.blue["400"]};
    }
`;
StyledChartFilterSwitcherItem.displayName = "StyledChartFilterSwitcherItem";
