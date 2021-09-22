import React from "react";
import { i18nFilter } from "filters/ngFilters";
import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { NewDataLabel } from "pages/lead-generator/lead-generator-all/components/elements";

const i18n = i18nFilter();

const TitleLink = styled.div`
    margin: 16px 0 12px 0;
    ${setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[500] })};
    line-height: 20px;
`;

const Text = styled.div`
    ${setFont({ $size: 16, $weight: 400, $color: colorsPalettes.carbon[400] })};
    line-height: 20px;
    margin-bottom: 20px;
`;
const StartPageBoxBottomRow = styled.div`
    vertical-align: center;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
`;

const BoxInfoText = styled.div`
    display: flex;
    align-items: center;
    > * {
        margin-bottom: 0;
        margin-left: 0;
        &:not(:first-child) {
            margin-left: 12px;
            ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[400] })};
        }
    }
`;

const StartPageTableContainer = styled.div<{ marginRight: string }>`
    margin-right: ${({ marginRight }) => (marginRight ? marginRight : 0)};
    margin-bottom: 24px;
    height: 212px;
    width: 320px;
    padding: 16px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0px 3px 6px rgba(14, 30, 62, 0.08);
    border-radius: 6px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    ${StartPageBoxBottomRow} {
        svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    &:hover {
        border: solid 1px ${colorsPalettes.navigation.BORDER_DARK_2};
        ${StartPageBoxBottomRow} {
            button {
                background-color: ${rgba(colorsPalettes.carbon[200], 0.2)};
            }
        }
    }
`;

export const StartPageBox = ({ link, onLinkClick }) => {
    return (
        <StartPageTableContainer
            onClick={() => onLinkClick(link.state, link.trackName)}
            marginRight={link.marginRight}
        >
            <SWReactIcons iconName={link.icon} size={"lg"} />
            <TitleLink>{i18n(link.title)}</TitleLink>
            <Text>{i18n(link.text)}</Text>
            <StartPageBoxBottomRow>
                <IconButton iconSize={"sm"} type="flat" iconName={"arrow-right"} />
                {link.infoText && (
                    <BoxInfoText>
                        <NewDataLabel>{link.infoBadgeText}</NewDataLabel>
                        <Text>{i18n(link.infoText)}</Text>
                    </BoxInfoText>
                )}
            </StartPageBoxBottomRow>
        </StartPageTableContainer>
    );
};
