import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import SavedSearchesDropdown from "./SavedSearchesDropdown";

export const StyledDropdownItemNewText = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.orange["400"], $size: 12 })};
`;

export const StyledDropDownItemCountText = styled.div`
    flex-shrink: 0;
    max-width: 50%;
`;

export const StyledSavedSearchesDropdown = styled(SavedSearchesDropdown)`
    min-width: 175px;
    position: relative;
`;

export const StyledImageContainer = styled.div`
    & span {
        & .SWReactIcons {
            & svg {
                & g {
                    stroke: transparent;
                }
            }
        }
    }
`;
