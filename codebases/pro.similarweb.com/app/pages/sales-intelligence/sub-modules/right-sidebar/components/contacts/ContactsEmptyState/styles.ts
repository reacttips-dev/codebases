import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";

export const StyledContactsEmptyState = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

export const EmptyStateIcon = styled(SWReactIcons)`
    svg {
        width: 160px;
        height: 99px;
    }
`;

export const StyledContactsEmptyStateTitle = styled.div`
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[500]};
`;
