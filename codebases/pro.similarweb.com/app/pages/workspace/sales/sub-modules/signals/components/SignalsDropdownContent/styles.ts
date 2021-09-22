import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledTab } from "@similarweb/ui-components/dist/tabs/src/Tab";
import { StyledDropdownContent } from "pages/workspace/sales/components/custom-dropdown/DropdownContent/styles";

export const StyledSignalsDropdownContent = styled(StyledDropdownContent)`
    ${StyledTab} {
        font-size: 14px;
        letter-spacing: 0.5px;
        min-width: 225px;
        white-space: nowrap;
        width: 50%;
    }

    .signals-tabs {
        padding-top: 10px;
    }

    .selected-tab .selected-signal {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }
`;
