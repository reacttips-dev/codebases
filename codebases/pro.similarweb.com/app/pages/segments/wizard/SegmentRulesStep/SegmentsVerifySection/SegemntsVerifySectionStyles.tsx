import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { ShareBarChart } from "@similarweb/ui-components/dist/share-bar";
import { subtitleFadeIn } from "components/Workspace/Wizard/src/steps/StyledComponents";

export const SegmentVerifySectionContainer = styled.div`
    flex: none;
    width: 460px;
    height: auto;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    font-family: "Roboto";
    border-radius: 6px;
    margin-top: 8px;
    margin-bottom: 8px;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
    animation: ${subtitleFadeIn} ease-in-out 1000ms;

    @media screen and (max-width: 1280px) {
        width: 100%;
    }
`;

export const TitleBox = styled.div`
    ${mixins.setFont({ $family: "Roboto", $size: 16, $color: "#2a3e52" })};
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-bottom: 1px solid #e9ebed;
`;

export const RuleSummary = styled.div`
    padding: 12px 16px 12px 16px;
    ${mixins.setFont({ $family: "Roboto", $size: 12, $color: rgba(colorsPalettes.carbon[300]) })};
    border-bottom: 1px solid #e9ebed;
    line-height: 20px;
`;

export const RulePrefix = styled.span`
    ${mixins.setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
`;

export const CountryRow = styled.div`
    display: flex;
    flex-direction: row;
    padding: 12px 16px 12px 16px;
    ${mixins.setFont({ $family: "Roboto", $size: 16, $color: "#7f8b97" })};
    align-items: baseline;
`;

export const SegmentShareContainer = styled.div`
    padding: 0 16px 8px 16px;
    width: 246px;
`;

export const VerifyShareContainer = styled.div<{ isVerified?: boolean }>`
    border-bottom: ${({ isVerified }) => (isVerified ? "1px solid #e9ebed" : "")};
`;

export const SegmentShareLabelRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    ${mixins.setFont({ $family: "Roboto", $size: 12, $color: "#2a3e52" })};
`;

export const SegmentShareDataRow = styled.div<{ isLowShare?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    ${({ isLowShare }) =>
        mixins.setFont({
            $family: "Roboto",
            $size: 16,
            $color: isLowShare ? "#FF442D" : "#2a3e52",
            $weight: 500,
        })};
`;

export const SharePrcentageStyle = styled.div`
    padding-right: 8px;
    width: 31px;
`;

export const StyledShareBar = styled.div`
    width: 95px;
    padding-right: 37px;
    ${ShareBarChart} {
        height: 12px;
    }
`;

export const VerifyButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 11px;
`;

export const CountryFlagContainer = styled.div`
    width: 14px;
    height: 14px;
    display: flex;
    padding-left: 8px;
`;

export const DropdownCountryFlagContainer = styled.div`
    width: 18px;
    height: 18px;
    padding-right: 8px;
`;

export const PublishSegmentContainer = styled.div`
    display: flex;
    padding: 0 16px 0 16px;
    ${mixins.setFont({ $family: "Roboto", $size: 12, $color: "#2a3e52" })};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 3px;
    align-items: baseline;
`;

export const LoadersMargin = styled.div<{ marginLeft?: string }>`
    margin-left: ${({ marginLeft }) => marginLeft};
`;
