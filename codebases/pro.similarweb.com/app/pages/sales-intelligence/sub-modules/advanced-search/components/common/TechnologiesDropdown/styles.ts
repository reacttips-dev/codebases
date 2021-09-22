import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledTab } from "@similarweb/ui-components/dist/tabs/src/Tab";
import { StyledDropdownContent } from "pages/workspace/sales/components/custom-dropdown/DropdownContent/styles";

export const CONTAINER_CLASSNAME = "technologies-filter-dropdown";

export const StyledDDContent = styled(StyledDropdownContent)`
    border-color: ${colorsPalettes.carbon["100"]};
    border-radius: 3px;
    width: 100%;

    ${StyledTab} {
        font-weight: 700;
        white-space: nowrap;
        width: 33.3%;

        &.selected.disabled:after {
            border-bottom-color: ${colorsPalettes.carbon["50"]};
        }
    }

    & .technologies-filter-dd-tabs {
        padding-top: 10px;
    }
`;

export const StyledDDContainer = styled.div`
    position: relative;
`;

export const StyledSmth = styled.div``;
