import styled from "styled-components";
import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";

export const NavBarSimpleItemSW = styled(NavBarSimpleItem)`
    & > div {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;

export const StyledBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;
`;
