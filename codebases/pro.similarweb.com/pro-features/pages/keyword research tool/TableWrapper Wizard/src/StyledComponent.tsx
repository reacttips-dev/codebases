import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";

export const Container = styled.div`
    height: 88px;
    display: flex;
    background: #ffffff;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    border-radius: 6px;
    width: 1087px;
    justify-content: center;
    align-items: center;
    position: relative;
`;
export const CountryContainer = styled.div`
    height: 40px;
    width: 190px;
    border: 1px #eceef0 solid;
    margin-left: 8px;
    margin-right: 8px;
    .CountryFilter-dropdownButton {
        ${setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
    }
`;
export const ButtonContainer = styled(Button)`
    margin-left: 8px;
`;
export const DropdownWrapper = styled.div`
    .DropdownButton {
        background: #ffffff;
        height: 40px;
    }
    .DropdownButton:hover {
        box-shadow: none;
        background-color: #f5f9fd;
    }
`;
export const WebSourceWrapper = styled.div`
    width: 190px;
    border: 1px #eceef0 solid;
    margin-left: 8px;
    .DropdownButton-text {
        ${setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
    }
    .WebSourceFilter-dropdownButton {
        justify-content: stretch;
    }
`;
export const InputContainer = styled.div`
    width: 335px;
`;

export const Text = styled.label<{ marginRight?: string }>`
    padding-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })}
`;

export const StyledIconButton = styled(SWReactIcons)`
    height: 13px;
    width: 13px;
    padding-top: 4px;
    padding-left: 5px;
`;

export const StyledIconButtonContainer = styled.div`
    border-radius: 69px;
    width: 25px;
    height: 25px;
    cursor: pointer;
    &:hover {
        background-color: ${colorsPalettes.carbon[25]};
    }
`;

export const SelectedKeywordOrGroupWithIndicatorContainer = styled.div`
    display: flex;
    padding: 8px 16px;
    justify-content: space-between;
    border: 1px solid ${colorsPalettes.carbon[50]};
    width: 300px;
`;

export const StyledIcon = styled(SWReactIcons)`
    height: 22px;
    width: 22px;
    margin-right: 14px;
    padding-top: 4px;
`;
