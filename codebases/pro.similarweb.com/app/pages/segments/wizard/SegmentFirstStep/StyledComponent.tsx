import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import styled, { css, keyframes } from "styled-components";

import {
    FakeInputContainer,
    Subtitle,
    subtitleFadeIn,
} from "../../../../../.pro-features/components/Workspace/Wizard/src/steps/StyledComponents";
import {
    RowInfo,
    StyledShareBarContainer,
} from "../../../website-analysis/website-content/leading-folders/components/Header";
import { EditButton } from "../../analysis/StyledComponents";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const buttonFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const ShareDisclaimerContainer = styled.div`
    background-color: ${colorsPalettes.bluegrey["200"]};
    padding: 6px 10px 6px 8px;
    display: flex;
    align-items: center;
    border-radius: 3px;
    .disclaimer-text {
        margin-left: 8px;
        color: ${colorsPalettes.carbon["500"]};
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 30px;
    text-align: right;
    text-transform: capitalize;
    animation: ${buttonFadeIn} ease-in-out 350ms;
    justify-content: space-between;
    display: flex;
    width: 100%;
    align-items: center;
`;
ButtonContainer.displayName = "ButtonContainer";

export const Content = styled.div`
    width: 538px;
    margin-top: 40px;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;
Content.displayName = "Content";

export const FakeInputContainerStyled = styled(FakeInputContainer)<{ isValid: boolean }>`
    border: 1px solid ${colorsPalettes.carbon["100"]};
    border-radius: 3px;
    padding: 2px 0px;
    ${({ isValid }) =>
        !isValid &&
        css`
            border-color: ${colorsPalettes.red["400"]};
        `}
`;
FakeInputContainerStyled.displayName = "FakeInputContainerStyled";

export const SubDomainsText = styled(Subtitle)`
    text-align: right;
    font-size: 12px;
    margin-top: 6px;
    margin-bottom: 19px;
`;
SubDomainsText.displayName = "SubDomainsText";

export const Label = styled(SubDomainsText)`
    margin-bottom: 2px;
    text-align: left;
    margin-top: 30px;
    text-transform: capitalize;
`;
Label.displayName = "Label";

export const ErrorLabel = styled.span`
    color: ${colorsPalettes.red["400"]};
    display: flex;
    margin-top: 2px;
`;
Label.displayName = "ErrorLabel";

export const UserSegmentListTypeSelectorContainer: any = styled.div`
    margin-top: 30px;
    .DropdownButton {
        background: ${colorsPalettes.carbon["0"]};
    }
    .DropdownButton--opened {
        .DropdownButton-text {
            color: ${colorsPalettes.carbon["0"]};
        }
    }
    .DropdownButton-text {
        color: ${colorsPalettes.carbon["400"]};
    }
`;
UserSegmentListTypeSelectorContainer.displayName = "UserSegmentListTypeSelectorContainer";

export const ShareBarLabel = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 16px;
    white-space: nowrap;
    color: ${colorsPalettes.carbon["400"]};
`;
export const ShareBarContainer = styled(StyledShareBarContainer)`
    max-width: 540px;
    margin-left: 20px;
    @media (max-width: 1440px) and (min-width: 1024px) {
        margin-left: 30px;
        margin-top: -8px;
    }
`;
export const ShareBarInner = styled.div`
    @media (max-width: 1440px) and (min-width: 1024px) {
        width: 230px;
    }
`;
export const StyledIconButton = styled(EditButton)`
    margin-left: 20px;
    margin-top: 0px;
    @media (max-width: 1440px) and (min-width: 1024px) {
        margin-left: 10px;
        flex-shrink: 0;
    }
`;
export const DeleteIconButton = styled(EditButton)`
    margin-left: 0px;
    margin-top: 0px;
`;

export const CloseIconButton = styled(IconButton)`
    margin-left: 10px;
    @media (max-width: 1440px) and (min-width: 1024px) {
        margin-left: 0px;
        flex-shrink: 0;
    }
`;
export const ExcelIconButton = styled(IconButton)`
    margin-left: 10px;
`;
export const StyledRowInfo = styled(RowInfo)`
    width: 100%;
`;
StyledRowInfo.displayName = "StyledRowInfo";
export const RowIndex = styled.div`
    margin: 0 42px 0px 4px;
`;
RowIndex.displayName = "RowIndex";

export const DomainContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: -8px;
    flex-basis: 300px;
`;
DomainContainer.displayName = "DomainContainer";

export const OptInBannerContainer = styled(FlexColumn).attrs({
    justifyContent: "flex-start",
})`
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    padding: 16px;
    border-radius: 4px;
    background: ${colorsPalettes.blue[100]};
`;

export const OptInBannerRow = styled(FlexRow).attrs<{ justifyContent: string }>(
    ({ justifyContent }) => ({
        justifyContent: justifyContent ?? "flex-start",
    }),
)`
    align-items: center;
    padding: 4px;
`;

export const OptInBannerSection = styled.div`
    display: flex;
    align-items: center;
`;

export const OptInBannerTextMain = styled.span`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;

export const OptInBannerTextDescription = styled.span`
    font-size: 14px;
    line-height: 18px;
    font-weight: 300;
    color: ${colorsPalettes.carbon[400]};
`;

export const BetaLabelContainer = styled.div`
    & > div {
        margin-left: 0;
        margin-right: 8px;
    }
`;
