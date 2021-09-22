import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";

export const StyledSwitcherContainer = styled.div`
    ${TextSwitcherItem} {
        height: 40px;
        width: 40px;

        .SWReactIcons g {
            filter: none;
        }

        &.selected {
            .SWReactIcons svg path {
                fill: ${colorsPalettes.carbon["500"]};
            }
        }

        // Special case for leaderboard icon
        &:first-child {
            .SWReactIcons > svg {
                height: 24px;
                width: 24px;

                & > g > g {
                    fill: ${colorsPalettes.carbon["200"]};
                }
            }
        }
    }
`;
