import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";

import { Legend, LegendStyled, LegendText, Marker } from "../../../Legends/src/LegendBase/Legend";

interface IBenchmarkToArenaLegendProps {
    onClose?: VoidFunction;
    sites: Array<{ domain: string; color: string }>;
    className?: string;
    hideLabel?: boolean;
}

export const Container = styled.div<{ onClose?: VoidFunction }>`
    position: relative;
    border: 1px solid ${colorsPalettes.carbon[50]};
    display: flex;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
    padding: 4px ${({ onClose }) => (onClose ? 36 : 16)}px 4px 16px;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 4px;
`;

const BenchmarkToLabel = styled.div`
    margin-right: 14px;
    flex-shrink: 0;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500], $weight: 400 })}
`;

export const Country = styled.div`
    display: flex;
    align-items: center;
`;

const Vs = styled.span`
    margin-right: 11px;
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.4) })}
`;

const IconWrapper = styled.div`
    cursor: pointer;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    svg {
        path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    &:hover {
        svg {
            path {
                fill: ${colorsPalettes.blue[500]};
            }
        }
    }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    ${LegendStyled} {
        overflow: hidden;
        min-width: 45px;
    }
    ${Marker} {
        flex-shrink: 0;
    }
    ${LegendText} {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const BenchmarkToArenaLegend: FunctionComponent<IBenchmarkToArenaLegendProps> = (
    { sites, onClose, className, hideLabel },
    { translate },
) => {
    const [main, ...rest] = sites;
    return (
        <Container
            className={className}
            onClose={onClose}
            data-automation="benchmark-to-arena-legend"
        >
            {!hideLabel && (
                <BenchmarkToLabel>
                    {translate("workspaces.marketing.keywordgroup.filters.benchmark.label")}
                </BenchmarkToLabel>
            )}
            <Legend color={main.color} name={main.domain} isMain={true} />
            <Vs>{translate("workspaces.marketing.keywordgroup.filters.benchmark.legend.vs")}</Vs>
            <Wrapper>
                {rest.map((site, index) => (
                    <Legend
                        color={site.color}
                        name={site.domain}
                        isMain={false}
                        key={`domain-${index}`}
                    />
                ))}
            </Wrapper>
            {onClose && (
                <IconWrapper onClick={onClose}>
                    <SWReactIcons iconName="clear-circle" size="sm" />
                </IconWrapper>
            )}
        </Container>
    );
};
BenchmarkToArenaLegend.displayName = "BenchmarkToArenaLegend";
BenchmarkToArenaLegend.contextTypes = {
    translate: PropTypes.func,
};
