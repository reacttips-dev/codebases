import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const AlertBoxContainer = styled.div`
    margin-top: auto;
    [class^="Container-"] {
        border-radius: 3px;
        padding: 14px 12px;
        button {
            white-space: nowrap;
            flex-shrink: 0;
        }
    }
`;

export const TextFieldContainer = styled.div`
    height: 66px;
`;

export const DangerZoneContent = styled(FlexRow)`
    justify-content: space-between;
    align-items: center;
    color: #2a3e52cc;
    > span {
        margin-right: 32px;
    }
`;

export const SectionContainer = styled.div`
    border: 1px solid #e5e7ea;
    height: 56px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 0 24px;
`;

export const MetricsContainer = styled(SectionContainer)`
    display: flex;
    justify-content: space-between;
    color: ${colorsPalettes.carbon[500]};
    font-size: 16px;
    margin-bottom: 8px;
    padding: 0 16px;
    > div {
        margin-right: 0;
    }
`;

export const LabelsWrapper = styled(FlexRow)`
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

export const StyledListSettingsTextFieldContainer = styled(TextFieldContainer)`
    margin-bottom: 24px;
`;

export const StyledListSettingsMetricsContainer = styled(MetricsContainer)`
    margin-bottom: 24px;
`;
