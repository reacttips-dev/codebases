import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { TabList, TabPanel } from "@similarweb/ui-components/dist/tabs";
import { DropdownContainer } from "pages/segments/components/benchmarkOvertime/StyledComponents";
import React from "react";
import { AssetsService } from "services/AssetsService";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css, keyframes } from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";

export const TableWrapper: any = styled(Box)<{ loading: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 100%;
    height: auto;
    border-radius: 6px;
    display: block;
`;

export const StyledButton = styled(Button)`
    white-space: nowrap;
`;

export const StyledIconButton = styled(IconButton)`
    margin-right: 25px;
`;

export const OptInBanner = styled(FlexRow)`
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: ${colorsPalettes.blue["100"]};
`;
export const OptInBannerInner = styled(FlexRow)`
    max-width: 980px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`;
export const OptInBannerInnerBlock = styled(FlexRow)`
    & > * {
        margin: 0 4px;
    }
`;
export const OptInBannerMainText = styled.div`
    font-size: 14px;
    line-height: 16px;
    color: ${colorsPalettes.midnight["500"]};
`;
export const OptInBannerSecondaryText = styled.div`
    font-size: 14px;
    line-height: 16px;
    color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
`;

export const PageContainer = styled(FlexColumn)`
    font-family: Roboto;
    padding: 32px;
    justify-content: center;
`;
export const SegmentsStartPageContainer = styled.div`
    margin: auto;
    max-width: 980px;
    width: 100%;
`;

export const PageTitle = styled.div`
    font-size: 24px;
    color: ${colorsPalettes.carbon["500"]};
    margin-bottom: 30px;
`;

export const containerFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
 `;

export const artFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const buttonFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const headerFadeIn = keyframes`
  0% {
    transform: translateY(-25px);
    opacity: 0;
  }
  50% {
    transform: translateY(-25px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1
  }
 `;

export const textFadeIn = keyframes`
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  65% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1
  }
 `;

export const Container = styled.div`
    width: 700px;
    border-radius: 6px;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    background-color: ${colorsPalettes.carbon["0"]};
    padding: 38px 91px 32px;
    box-sizing: border-box;
    margin: auto;
`;
export const InnerContainer = styled.div<{ fadeOut: boolean }>`
    ${({ fadeOut }) =>
        fadeOut
            ? css`
                  animation: ${containerFadeOut} ease 600ms;
              `
            : null};
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const GifContainer = styled.div`
    height: 205px;
    width: 225px;
    margin-bottom: 30px;
    animation: ${artFadeIn} ease-in-out 1000ms;
    background-image: url(${AssetsService.assetUrl("/images/segments/segments_empty_state.gif")});
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
`;
GifContainer.displayName = "GifContainer";

export const Header = styled.div`
    ${setFont({ $size: 30, $weight: 700 })};
    max-width: 510px;
    text-align: center;
    line-height: 32px;
    word-break: break-all;
    animation: ${headerFadeIn} ease-in-out 1210ms;
`;
export const Text = styled.div`
    width: 430px;
    ${setFont({ $size: 16, $weight: 400 })};
    margin: 18px 136px 24px 136px;
    line-height: 24px;
    text-align: center;
    animation: ${textFadeIn} ease-in-out 1210ms;
`;
export const ButtonContainer = styled.div`
    margin-right: 247px;
    margin-left: 247px;
    animation: ${buttonFadeIn} ease-in-out 1600ms;
`;
export const SegmentsContainer = styled.div``;

export const SegmentsComparisonContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

export const TabsContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0px 4px 6px 0px rgba(202, 202, 202, 0.5);
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    border-radius: 5px 5px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    padding: 0px;
    justify-content: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    ${TabPanel} {
        margin: 0 auto;
    }
    .react-tabs {
        width: 100%;
    }
`;
export const TabListStyled = styled(TabList)`
    border-bottom: 0;
    z-index: 1;
    .firstTab,
    .secondTab {
        padding: 18px 24px;
    }
`;

export const SegmentsEllipsisButton = styled.div.attrs({
    children: <IconButton type="flat" iconName="dots-more" />,
})`
    .SWReactIcons svg {
        width: 24px;
        height: 24px;
    }
`;

export const StyledDropdownContainer = styled(DropdownContainer)`
    width: auto;
`;

export const ComparisonTableEmptyStateContainer = styled.div`
    border-radius: 3px;
    background-color: ${colorsPalettes.sky["100"]};
    display: flex;
    align-items: center;
    padding: 0px 20px;
    width: 100%;
`;

export const TitleContainer = styled.div`
    width: calc(100% - 270px);
    margin-left: 15px;
`;

export const EmptyStateTitle = styled.div`
    height: 34px;
    font-size: 20px;
    font-weight: 500;
    color: #2a3d53;
    line-spacing: auto;
    text-align: left;
    margin-top: 15px;
`;
export const EmptyStateSubtitle = styled.div`
    height: 59px;
    font-size: 14px;
    color: rgba(52, 70, 90, 0.6);
    line-spacing: 20px;
    character-spacing: -0.2px;
    text-align: left;
`;
