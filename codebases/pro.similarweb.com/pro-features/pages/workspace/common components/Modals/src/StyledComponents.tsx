import { colorsPalettes } from "@similarweb/styles";
import styled, { css } from "styled-components";
import { Banner } from "@similarweb/ui-components/dist/banner/src/Banner";
import {
    BannerTextContainer,
    BannerSecondaryText,
    BannerCloseContainer,
    BannerImageContainer,
    BannerSectionContainer,
} from "@similarweb/ui-components/dist/banner/src/BannerStyles";

export const Footer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 25px;
    button {
        margin-left: 8px;
    }
`;

export const CountryContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 15px;
`;

export const SelectedKeysContainer = styled.div<{ isDropDownOpen: boolean }>`
    height: 256px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    padding-bottom: 16px;
    overflow: hidden;
    position: relative;
    z-index: 1;
`;

export const ItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
`;
//TODO: need to fix tooltip background
export const ErrorMsg = styled.div`
    .Popup-content.PlainTooltip-content {
        background: ${colorsPalettes.red[300]};
    }
`;

interface IsError {
    isError: boolean;
}

export const WebsitesModalAutoComplete = styled.div<IsError>`
    margin-top: 10px;
    div:first-child {
        ${(props) =>
            props.isError &&
            css`
                height: auto !important;
            `}
    }
    .SearchInput-container .SearchInput {
        width: calc(100% - 54px);
    }

    .ListItemsContainer {
        position: absolute;
        width: 100%;
        z-index: 2;
        box-sizing: border-box;
    }
    > div > div {
        padding: 0;
        transform: none;
    }
`;

export const WebsiteModalContainer = styled.div`
    max-height: 240px;
    overflow: auto;
`;

export const WebsiteModalHeaderContainer = styled.div`
    height: 50px;
`;
export const EditOpportuntiesModalTitle = styled.div`
    height: 18px;
    color: ${colorsPalettes.carbon[400]};
    font-size: 14px;
    margin-bottom: 4px;
`;

export const StyledProTipBanner = styled(Banner)`
    align-items: flex-start;
    margin-top: 20px;
    padding-bottom: 24px;
    padding-top: 0;

    ${BannerSectionContainer} {
        align-items: flex-start;
    }

    ${BannerImageContainer} {
        margin-top: 24px;
    }

    ${BannerTextContainer} {
        margin-left: 16px;
        margin-top: 24px;
    }

    ${BannerSecondaryText} {
        line-height: 24px;
        margin-top: 2px;
    }

    ${BannerCloseContainer} {
        margin-top: 14px;
    }
`;
