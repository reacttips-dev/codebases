import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const Tab = styled.div<{ active: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0px;
    box-sizing: border-box;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    &:hover {
        cursor: pointer;
    }

    ${({ active }) =>
        active &&
        css`
            padding-bottom: 11px;
            border-bottom: 2px solid ${colorsPalettes.blue["400"]};
            color: ${colorsPalettes.blue["400"]};
        `};
`;

export const StyledAbout = styled(Tab)`
    .SWReactIcons {
        height: 24px;
        width: 24px;
        svg {
            g {
                path:last-child {
                    fill: ${({ active }) =>
                        active ? colorsPalettes.blue[400] : colorsPalettes.carbon[300]};
                }
            }
        }
    }
`;

export const StyledBenchmarks = styled(Tab)`
    .SWReactIcons {
        height: 24px;
        width: 24px;
        svg {
            path {
                fill: ${({ active }) =>
                    active ? colorsPalettes.blue[400] : colorsPalettes.carbon[300]};
            }
        }
    }
`;

export const StyledSiteTrends = styled(Tab)`
    .SWReactIcons {
        height: 24px;
        width: 24px;
        svg {
            polygon {
                fill: ${({ active }) =>
                    active ? colorsPalettes.blue[400] : colorsPalettes.carbon[300]};
            }
            polyline {
                stroke: ${({ active }) =>
                    active ? colorsPalettes.blue[400] : colorsPalettes.carbon[300]};
            }
        }
    }
`;

export const StyledContacts = styled(Tab)`
    .SWReactIcons {
        height: 24px;
        width: 24px;
        svg {
            path {
                fill: ${({ active }) =>
                    active ? colorsPalettes.blue[400] : colorsPalettes.carbon[300]};
            }
        }
    }
`;
