import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { AssetsService } from "services/AssetsService";
import { subtitleFadeIn } from "components/Workspace/Wizard/src/steps/StyledComponents";

/**
 * Container for the segment page results (right part of the screen)
 */
export const SegmentPageResultsContainer = styled.div`
    flex: auto;
    overflow: hidden;
    background: ${colorsPalettes.bluegrey[200]};
    padding: 0;
    margin-top: 6px;
    border-radius: 6px 6px 0 0;
    position: relative;
    width: 460px;
    display: flex;
    flex-direction: column;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;

    @media screen and (max-width: 1280px) {
        width: 100%;
        max-height: 60vh;
    }
`;

export const PageResultsTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 17px 24px;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;

export const PageResultsTitle = styled.h1`
    font-size: 20px;
    color: ${colorsPalettes.carbon[400]};
    font-family: "Roboto";
    font-weight: 500;
    margin: 0;
    margin-right: 9px;
`;

export const PageResultsContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 17px 24px;
    font-size: 18px;
    color: ${colorsPalettes.carbon[400]};
    font-family: "Roboto";
`;

export const SegmentTipsIcon = styled.div`
    width: 16px;
    height: 30px;
    margin-right: 11px;
    background: url(${AssetsService.assetUrl("/images/segments/light-bulb.svg")}) top no-repeat;
`;

export const SegmentTipsUrl = styled.a.attrs<{ url: string }>({
    href: ({ url }) => url,
    target: "_blank",
})<{ url: string }>`
    cursor: pointer;
    color: ${colorsPalettes.blue["400"]};
`;

export const SegmentTipsList = styled.ul`
    list-style: initial;
    padding-left: 24px;
    padding-right: 60px;

    li {
        font-size: 16px;
        font-family: "Roboto";
        color: ${colorsPalettes.carbon[400]};
        line-height: 26px;
        margin-bottom: 16px;
        animation: ${subtitleFadeIn} ease-in-out 1000ms;
    }
`;

export const SegmentTipsHighlight = styled.span`
    font-weight: bold;
`;

export const PageResultsWarningContainer = styled.div`
    flex: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const PageResultsImage = styled.div<{ imageUrl: string; width: string; height: string }>(
    (props) => `
    width: ${props.width};
    height: ${props.height};
    margin-bottom: 16px;
    background-image: url(${props.imageUrl});
    background-size: contain;
    background-repeat: no-repeat;
`,
);

export const PageResultsContentWarning = styled(PageResultsContent)`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;

    & > span:first-child {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 12px;
    }
`;

export const SegmentPageResultsLoaderContainer = styled.div`
    width: 426px;
    height: 466px;
    margin-top: 50px;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;

    @media screen and (max-width: 1280px) {
        width: 100%;
    }
`;
