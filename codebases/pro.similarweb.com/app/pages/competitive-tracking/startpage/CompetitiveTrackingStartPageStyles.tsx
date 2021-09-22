import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PageContentContainer } from "../common/styles/CompetitiveTrackingStyles";

export const StartPageContainer = styled(PageContentContainer)`
    height: 463px;
    width: 787px;
`;

export const StartPageImage = styled.div<{ imageUrl: string }>`
    background: url(${({ imageUrl }) => imageUrl}) top no-repeat;
    background-size: 200px 200px;
    width: 200px;
    height: 200px;
    margin-bottom: 15px;
`;

export const StartPageTitle = styled.span`
    font-size: 34px;
    color: ${colorsPalettes.carbon[500]};
    font-weight: 500;
    font-family: "DM Sans";
    margin-bottom: 31px;
`;

export const StartPageSubtitle = styled.span`
    font-size: 16px;
    max-width: 540px;
    color: ${colorsPalettes.carbon[400]};
    font-weight: 400;
    text-align: center;
    line-height: 24px;
    margin-bottom: 36px;
`;

export const StartPageButton = styled(IconButton)`
    margin-bottom: 55px;
`;
