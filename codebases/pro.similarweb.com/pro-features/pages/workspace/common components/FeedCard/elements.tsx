import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import styled, { css } from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";

const lineClamp = (rows) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${rows};
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: initial;
`;

export const CardListContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    background-color: #f5f9fd;
    max-width: 100%;
    box-sizing: border-box;
`;
CardListContainer.displayName = "CardListContainer";

export const FeedbackWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    height: 40px;
    margin-right: -8px;
    button,
    button:hover {
        .SWReactIcons svg path {
            fill: ${rgba(colorsPalettes.carbon[500], 0.2)};
        }
    }
`;

export const FeedCardWrapper = styled.div<{ visible: boolean }>`
    max-height: ${(props) => (props.visible ? "400px" : 0)};
    overflow: hidden;
    transition: all 0.2s 0.2s;
`;

export const FeedCardContainer = styled.div<{
    seen: boolean;
    hasFeedback?: boolean;
    visible: boolean;
}>`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 3px 20px 20px;
    margin: 0 0 8px 0;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px #0e1e3e14;
    border-radius: 6px;
    border-left: ${(props) =>
        props.seen
            ? `4px solid ${colorsPalettes.carbon[0]}`
            : `4px solid ${colorsPalettes.blue[400]}`};
    user-select: none;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 500;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity 0.2s;
    ${FeedbackWrapper} {
        transition: opacity 0.2s;
        opacity: ${({ hasFeedback }) => (hasFeedback ? 1 : 0)};
    }
    :hover ${FeedbackWrapper} {
        opacity: 1;
    }
`;
FeedCardContainer.displayName = "FeedCardContainer";

export const NewsFeedCardContainer = styled(FeedCardContainer)`
    padding-top: 16px;
`;

export const FeedCardTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    color: ${colorsPalettes.carbon[500]};
`;

export const NewsFeedCardTitle = styled(FeedCardTitle)`
    ${lineClamp(2)};
    margin-right: 44px;
    padding: 4px 0 0;
`;

export const NewsItemPublisher = styled.div`
    font-size: 12px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    margin: 8px 0;
`;

export const FeedCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
`;
export const NewsFeedCardHeader = styled(FeedCardHeader)`
    height: auto;
`;

export const DismissCard = styled.div`
    user-select: none;
    border-radius: 50%;
    display: flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 3px;
    cursor: pointer;
    opacity: 0;
    transform: scale3d(0.6, 0.6, 1);
    transition: all 0.1s ease-out;
    ${FeedCardWrapper}:hover & {
        opacity: 1;
        background-color: ${colorsPalettes.carbon[200]};
        transform: scale3d(1, 1, 1);
    }
    ${SWReactIcons} {
        width: 8px;
        height: 8px;
        display: flex;
        align-items: center;
        justify-items: center;
    }
    svg {
        width: 100%;
        height: 100%;
    }
    path {
        stroke: #fff;
        stroke-width: 2px;
    }
`;

const defaultImageUrl = AssetsService.assetUrl("images/image-fallback.svg");

function hideImage(e) {
    (e.target as HTMLImageElement).style.display = "none";
}

const ArticleImage = styled.img.attrs((props) => ({
    onError: hideImage,
}))`
    display: block;
    width: 111px;
    height: 88px;
    object-fit: cover;
    background-color: white;
`;

export const PublishedImage = styled.div.attrs<{ "data-url": string }>(({ "data-url": url }) => ({
    children: !!url && <ArticleImage src={url} />,
}))`
    height: 88px;
    margin-right: 8px;
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${defaultImageUrl});
    flex: 0 0 111px;
    background-color: ${colorsPalettes.carbon[50]};
`;

export const NewsLinkButton = styled(IconButton)<{ isDisabled: boolean }>`
    ${(p) =>
        p.isDisabled &&
        css`
            &&& {
                a,
                a:link,
                a:hover,
                a:active {
                    color: ${colorsPalettes.carbon[200]};
                }
                div.SWReactIcons {
                    display: none;
                }
            }
        `}
`;

export const NewsCardBody = styled.div`
    display: flex;
    align-items: center;
    margin-top: 5px;
`;

export const CountryBadge = styled.div`
    height: 28px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 6px;
    margin-right: 8px;
    font-size: 14px;
    border-radius: 3px;
    background-color: ${rgba(colorsPalettes.carbon[500], 0.04)};
    color: ${colorsPalettes.carbon[400]};
`;

export const NewsBadge = styled(CountryBadge)`
    svg path {
        fill: currentColor;
    }
`;

export interface IChange {
    change: number | string;
}

export const ChangeBadge = styled(CountryBadge)<IChange>`
    color: ${(props) => {
        if (props.change < 0) {
            return colorsPalettes.red.s100;
        } else if (props.change > 0) {
            return colorsPalettes.green.s100;
        }
        return "currentColor";
    }};
    svg path {
        fill: currentColor;
    }
`;

export const WebSourceBadge = styled(CountryBadge)`
    svg path {
        fill: ${colorsPalettes.carbon[400]};
    }
`;

export const CardsBadgeLine = styled.div`
    flex-grow: 1;
    display: flex;
    box-sizing: border-box;
    width: 100%;
`;

export const CardBodyContainer = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    margin: 8px 0 4px;
    flex-grow: 1;
    [data-domain-name] {
        word-break: break-all;
    }
`;

export const CardNewsSummary = styled(CardBodyContainer)`
    ${lineClamp(4)};
    margin: 0;
`;

export const FeedCardLink = styled.a`
    font-weight: 500;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    :link,
    :hover,
    :visited,
    :active {
        color: #4c88f0;
        text-decoration: none;
    }
    div {
        margin-left: 4px;
    }
`;

export const FeedCardLinkContainer = styled.div`
    margin: 0 -16px -8px;
`;

export const CardListDataDate = styled.div<{ visible: boolean }>`
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-size: 14px;
    margin-bottom: 10px;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    height: ${({ visible }) => (visible ? "20px" : 0)};
    transition: all 0.2s;
`;

export const FeedbackActionWrapper = styled.div<{ visible: boolean }>`
    transition: all 300ms ease;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const IconButtonWrapper = styled.div<{
    mirror?: boolean;
    feedbackSet?: boolean;
    visible?: boolean;
}>`
    width: ${({ visible }) => (visible ? "40px" : 0)};
    transition: width 300ms ease;
    transition-delay: 300ms;
    button {
        ${({ feedbackSet }) =>
            feedbackSet &&
            css`
                cursor: unset;
                pointer-events: none;
                :hover {
                    background-color: transparent;
                }
            `}
        .SWReactIcons svg {
            transform: ${({ mirror }) => (mirror ? "scale(-1, 1)" : "scale(1, 1)")};
            path {
                fill: ${rgba(colorsPalettes.carbon[500], 0.2)};
            }
        }
    }
`;

export const FeedbackModalHeader = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    color: ${colorsPalettes.carbon[500]};
    padding: 24px;
`;

export const FeedbackModalCardWrapper = styled.div`
    background-color: ${rgba(colorsPalettes.carbon[500], 0.1)};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 158px;
    ${FeedCardContainer} {
        width: 392px;
        height: 134px;
        margin: 0;
        padding: 8px 16px;
    }
`;

export const FeedbackModalReason = styled.div`
    align-items: center;
    font-size: 14px;
    color: ${colorsPalettes.carbon[500]};
    padding: 16px 24px;
    cursor: pointer;
    transition: background-color 500ms;
    :hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.06)};
    }
`;

export const FeedbackModalFreeText = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
    button {
        align-self: flex-end;
    }
`;

export const FeedbackModalInput = styled.textarea`
    resize: none;
    width: 392px;
    height: 80px;
    padding: 16px;
    margin-bottom: 24px;
    box-sizing: border-box;
    border: ${`1px solid ${colorsPalettes.carbon[100]}`};
    border-radius: 4px;
    box-shadow: none;
    :focus {
        border: ${`1px solid ${colorsPalettes.blue[400]}`};
        outline: none;
    }
`;
