import styled from "styled-components";
import { StyledDropdownContent } from "pages/workspace/sales/components/custom-dropdown/DropdownContent/styles";
import { StyledDropdownSearch } from "pages/workspace/sales/components/custom-dropdown/DropdownSearch/styles";

export const StyledListsDropdownContent = styled(StyledDropdownContent)`
    width: 320px;

    ${StyledDropdownSearch} {
        .input-container {
            input {
                padding: 20px 16px 20px 0;
            }
        }
    }
`;
