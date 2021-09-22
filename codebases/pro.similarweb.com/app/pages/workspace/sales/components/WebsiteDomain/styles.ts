import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledColorBadge = styled.div<{ color: string }>`
    background-color: ${({ color }) => color};
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 50%;
    bottom: -4px;
    height: 10px;
    position: absolute;
    right: -3px;
    width: 10px;
`;

export const StyledEditIcon = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 8px;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 200ms ease-in-out;
    width: 100%;

    .SWReactIcons svg path {
        fill: ${colorsPalettes.blue["400"]};
        fill-opacity: 1;
    }
`;

export const StyledIconContainer = styled.div<{ faviconSize: "md" | "sm" }>`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    height: ${({ faviconSize }) => (faviconSize === "md" ? 32 : 24)}px;
    justify-content: center;
    margin-right: ${({ faviconSize }) => (faviconSize === "md" ? 8 : 4)}px;
    position: relative;
    transition: border-color 200ms ease-in-out;
    width: ${({ faviconSize }) => (faviconSize === "md" ? 32 : 24)}px;

    img {
        display: block;
        min-width: 16px;
        max-width: 16px;
    }
`;

export const StyledDomainText = styled.span`
    color: ${colorsPalettes.carbon["500"]};
    display: inline-block;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledCloseIconContainer = styled.div`
    cursor: pointer;
    flex: 0 0 auto;
    padding: 8px;
    transition: opacity 200ms ease-in-out;

    &:hover {
        .SWReactIcons {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 auto;

            svg {
                path {
                    fill: ${colorsPalettes.blue["400"]} !important;
                    fill-opacity: 1;
                    transition: fill 200ms ease-out;
                }

                defs {
                    path {
                        fill: ${colorsPalettes.blue["400"]} !important;
                    }
                }

                use {
                    fill: ${colorsPalettes.blue["400"]} !important;
                }

                g {
                    stroke: ${colorsPalettes.blue["400"]} !important;

                    mask {
                        fill: ${colorsPalettes.blue["400"]} !important;
                    }
                }
            }
        }
    }
`;

export const StyledWebsiteDomainContainer = styled.div<{
    onClose?(): void;
    closable: boolean;
    clickable: boolean;
    closeIconHovered: boolean;
}>`
    align-items: center;
    background-color: transparent;
    border-radius: 8px;
    box-sizing: border-box;
    cursor: ${({ onClick, clickable }) => (onClick && clickable ? "pointer" : "default")};
    display: flex;
    height: 32px;
    max-width: 170px;
    ${({ closable }) =>
        !closable &&
        css`
            padding-right: 8px;
        `};
    transition: background-color 200ms ease-out;

    &:hover {
        ${({ onClick, clickable, closeIconHovered }) =>
            onClick &&
            clickable &&
            css`
                background-color: ${colorsPalettes.navigation["ACTIVE_TILE_BACKGROUND"]} !important;

                ${StyledIconContainer} {
                    ${!closeIconHovered &&
                    css`
                        border-color: ${colorsPalettes.blue["400"]};
                    `}

                    ${StyledEditIcon} {
                        opacity: ${closeIconHovered ? 0 : 1};
                    }
                }
            `};
        ${({ onClose }) =>
            onClose &&
            css`
                ${StyledCloseIconContainer} {
                    .SWReactIcons {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex: 0 0 auto;

                        svg {
                            path {
                                fill: ${colorsPalettes.carbon["400"]};
                                fill-opacity: 1;
                                transition: fill 200ms ease-out;
                            }

                            defs {
                                path {
                                    fill: ${colorsPalettes.carbon["400"]};
                                }
                            }

                            use {
                                fill: ${colorsPalettes.carbon["400"]};
                            }

                            g {
                                stroke: ${colorsPalettes.carbon["400"]};

                                mask {
                                    fill: ${colorsPalettes.carbon["400"]};
                                }
                            }
                        }
                    }
                }
            `};
    }
`;
