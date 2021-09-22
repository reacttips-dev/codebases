import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const StyledEmailButton = styled(IconButton)`
    cursor: ${({ isLoading }) => (isLoading ? "default" : "pointer")};
`;

export const StyledEmailSendButtonContainer = styled.div`
    align-items: center;
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    cursor: default;
    display: flex;
    justify-content: flex-end;
    padding: 15px 17px;
`;

export const StyledContentWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
`;

export const StyledMessageWrapper = styled.div`
    display: flex;
    margin-left: 10px;
    font-family: Roboto;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    line-height: 16px;
    color: ${colorsPalettes.carbon["200"]};
    letter-spacing: 0px;
    text-align: left;
`;
