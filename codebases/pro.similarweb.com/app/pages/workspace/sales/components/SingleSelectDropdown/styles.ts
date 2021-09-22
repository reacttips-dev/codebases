import styled from "styled-components";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";

export const StyledButton = styled(Button)`
    border-radius: 0;

    div {
        color: ${colorsPalettes.carbon[500]};
    }

    &.noHover {
        color: ${colorsPalettes.carbon[500]} !important;

        &: hover {
            color: ${colorsPalettes.carbon[500]} !important;
            background: transparent;
        }
    }
`;
export const StyledOptionDescription = styled.div`
    opacity: 0.6;
    width: inherit;
    word-break: break-word;
    white-space: normal;
    font-size: 12px;
`;

export const StyledDropdownItem = styled(EllipsisDropdownItem)`
    height: auto;
    padding: 28px 17px;
    width: 300px;
`;

export const StyledSingleDropdown = styled(Dropdown)`
    &.isLoading {
        pointer-events: none;
    }
    &.noHover {
        cursor: pointer;
    }
`;

export const StyledDropdownButton = styled.div`
    & .DropdownButton {
        font-size: 16px;
        border: none;
        color: ${colorsPalettes.carbon[500]};
        background: transparent;

        & .DropdownButton-text {
            justify-content: flex-end;
        }

        &: hover {
            box-shadow: none;
        }

        & .DropdownButton--triangle {
            &: active {
                color: ${colorsPalettes.carbon[500]};
            }
        }
    }
`;
