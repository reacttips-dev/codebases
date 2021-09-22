import * as React from "react";
import styled, { css } from "styled-components";

import { FunctionComponent } from "react";
import { StyledBox } from "../../../../styled components/Workspace/src/StyledWorkspaceBox";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { SWReactCountryIcons } from "@similarweb/icons";
import { IItemIconProps } from "@similarweb/ui-components/dist/item-icon";
import {
    SimpleLegend,
    SimpleLegendItemIconContainer,
} from "@similarweb/ui-components/dist/simple-legend";
import * as propTypes from "prop-types";
import { ICountryObject } from "../../../../../app/services/CountryService";
import StackedIcons from "./StackedIcons";

const BenchmarkToArenaItemContainer = styled.div`
    padding: 14px 12px;
`;

const BenchmarkToArenaItemTitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $size: 16, $weight: 500 })};
    display: flex;
    align-items: center;
`;

const CountryIcon = styled(SWReactCountryIcons)`
    margin: 0 8px;
`;

const CountryName = styled.span`
    ${mixins.setFont({ $size: 14 })};
`;

const BenchmarkToArenaItemContent = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;
`;

const VS = styled.span`
    ${mixins.setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    margin-right: 10px;
`;

const IconContainer = styled(SimpleLegendItemIconContainer)<{ index: number } & IItemIconProps>`
    ${({ index }) =>
        index &&
        css`
            transform: translateX(-${index * 10}px);
        `}
`;

const Box = styled(StyledBox)`
    margin-bottom: 12px;
    border: 1px solid transparent;
    background-color: ${colorsPalettes.carbon[0]};
    &:hover {
        border-color: ${colorsPalettes.blue[400]};
    }
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
`;

export interface IBenchmarkToArenaItemProps {
    title: string;
    country: Pick<ICountryObject, "id" | "text">;
    mainDomain: {
        domain: string;
        favicon: string;
    };
    competitorsIcons: string[];
    onClick: () => void;
}

export const BenchmarkToArenaItem: FunctionComponent<IBenchmarkToArenaItemProps> = (
    { title, country, competitorsIcons, mainDomain, onClick },
    { translate },
) => {
    const mainItem = {
        name: mainDomain.domain,
        icon: mainDomain.favicon,
    };
    return (
        <Box onClick={onClick}>
            <BenchmarkToArenaItemContainer>
                <BenchmarkToArenaItemTitle>
                    {title}
                    <CountryIcon countryCode={country.id} size="xs" />
                    <CountryName>{country.text}</CountryName>
                </BenchmarkToArenaItemTitle>
                <BenchmarkToArenaItemContent>
                    <SimpleLegend items={[mainItem]} />
                    <VS>
                        {translate("workspaces.marketing.keywordgroup.filters.benchmark.vs", {
                            count: competitorsIcons.length.toString(),
                        })}
                    </VS>
                    <StackedIcons icons={competitorsIcons} />
                </BenchmarkToArenaItemContent>
            </BenchmarkToArenaItemContainer>
        </Box>
    );
};

BenchmarkToArenaItem.contextTypes = {
    translate: propTypes.func,
};
