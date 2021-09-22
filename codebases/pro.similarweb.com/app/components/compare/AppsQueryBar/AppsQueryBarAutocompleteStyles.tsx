import { SWReactIcons } from "@similarweb/icons";
import { IAutocompleteStyledProps } from "./AppsQueryBarAutocompleteTypes";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";

// The props are necessary for a responsive design.
export const AutocompleteStyled = styled(Autocomplete)<IAutocompleteStyledProps>`
    width: ${({ width }) => (width ? `${width}px` : "408px")};
    max-height: 380px;
    position: ${({ position }) => (position ? position : "absolute")};
    z-index: 1030;
    left: ${({ left }) => left ?? "-80px"};
    top: ${({ top }) => (top ? `${top}px` : 0)};
    ${({ right }) =>
        right
            ? css`
                  right: ${right};
              `
            : null};
    .ListItemsContainer {
        box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24);
        .autocomplete-tab {
            padding: 0 0 8px;
            .SWReactIcons {
                padding-left: 15px;
                margin-right: 14px;
                display: flex;
                svg {
                    width: 16px;
                    height: 16px;
                }
            }
            &:hover {
                .SWReactIcons svg path {
                    fill: ${colorsPalettes.carbon[500]};
                }
            }
            &.disabled {
                .SWReactIcons svg path {
                    fill: ${colorsPalettes.carbon[100]};
                }
            }
            &.selected {
                .SWReactIcons svg path {
                    fill: ${colorsPalettes.blue[400]};
                }
            }
        }
    }
`;

export const NoDataWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const NoDataIcon = styled(SWReactIcons)`
    height: 24px;
    width: 24px;
    margin: 16px 0 8px;
`;

export const NoDataText = styled.div`
    font-size: 16px;
    margin-bottom: 40px;
    max-width: 40%;
    color: ${colorsPalettes.midnight[100]};
    text-align: center;
`;
