import styled from "styled-components";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";

export const StyledOptionDescription = styled.div`
    opacity: 0.6;
    width: inherit;
    word-break: break-word;
    white-space: normal;
    font-size: 12px;
`;

export const StyledAddWebsitesDropdownItem = styled(EllipsisDropdownItem)`
    height: auto;
    padding: 12px;
`;

export const StyledButtonsSection = styled.div``;

export const StyledDropdownsSection = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledControlsSection = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
`;
