import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledDynamicListTableContainer = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    margin-top: 20px;
    padding-bottom: 100px;
`;

export const StyledDynamicListOnlyDesktopWarning = styled.div`
    margin-top: 8px;
    padding: 0 24px;
`;

export const StyledDynamicListFilters = styled.div`
    margin-top: 12px;
    padding: 0 24px;
`;

export const StyledDynamicListPage = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    height: 100%;
`;
