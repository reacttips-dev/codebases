import { Banner } from "@similarweb/ui-components/dist/banner";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const RelatedSearchTermsBannerContainer = styled(Banner)`
    background-color: ${colorsPalettes.blue[100]};
    height: 72px;
    margin-bottom: 22px;

    .BannerImageContainer {
        background-color: white;
    }

    .bannerIcon {
        background-color: white;
        border-radius: 100%;
    }
`;

export const BannerTitleContainer = styled(FlexRow)`
    align-items: center;

    p {
        color: #092540;
        font-size: 16px;
        font-weight: bold;
        margin-right: 6px;
    }
`;
