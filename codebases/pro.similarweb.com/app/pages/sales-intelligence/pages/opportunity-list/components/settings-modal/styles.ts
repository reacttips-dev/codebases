import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { StyledTab } from "@similarweb/ui-components/dist/tabs/src/Tab";

export const StyledLabel = styled.div`
    margin-bottom: 6px;

    span {
        ${mixins.setFont({ $color: rgba(colorsPalettes.carbon["500"], 0.6), $size: 12 })};
    }
`;

export const StyledMetricSwitch = styled.div`
    flex-shrink: 0;
`;

export const StyledMetricName = styled.div`
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16 })};
    }
`;

export const StyledMetric = styled.div`
    align-items: center;
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 8px;
    display: flex;
    height: 56px;
    justify-content: space-between;
    padding: 0 16px;

    &:not(:last-child) {
        margin-bottom: 8px;
    }
`;

export const StyledMetricSection = styled.div`
    &:last-child {
        margin-bottom: 16px;
    }
`;

export const StyledNameEditSection = styled.div`
    margin-bottom: 16px;
`;

export const StyledDeleteSection = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.red["100"]};
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    padding: 14px 12px;

    & > p {
        ${mixins.setFont({ $color: rgba(colorsPalettes.carbon["500"], 0.8), $size: 14 })};
        margin: 0 32px 0 0;
    }

    & .Button {
        flex-shrink: 0;
        white-space: nowrap;
    }
`;

export const StyledSettingsFeed = styled.div``;

export const StyledSettingsInfo = styled.div`
    padding: 0 24px 24px;
`;

export const StyledSubmitSection = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon["100"]};
    display: flex;
    justify-content: flex-end;
    padding: 16px;
`;

export const StyledModalTitle = styled.div`
    max-width: 100%;
    overflow: hidden;
    padding: 24px 60px 24px 24px;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16 })};
    }
`;

export const StyledModalContent = styled.div`
    ${StyledTab} {
        font-size: 14px;
        letter-spacing: 0.5px;
        min-width: 225px;
        white-space: nowrap;
        width: 50%;
    }
`;
