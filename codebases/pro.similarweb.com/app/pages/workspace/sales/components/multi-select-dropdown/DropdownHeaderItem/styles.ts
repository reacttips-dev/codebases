import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledDropdownHeader = styled.div`
    border-bottom: 1px solid ${colorsPalettes.navigation["ICON_BAR_BACKGROUND"]};
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    padding: 0 45px 0 24px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(42, 62, 82, 0.6);
    background-color: ${colorsPalettes.carbon["0"]};
`;
