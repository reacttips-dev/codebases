import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import styled from "styled-components";

export const StyledNoTouchListTitle = styled.h6`
    margin: 12px 0 10px;
    font-size: 12px;
    color: rgba(42, 62, 82, 0.6);
    line-height: 1.33;
`;
StyledNoTouchListTitle.displayName = "StyledNoTouchListTitle";

export const StyledNoTouchList: any = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`;
StyledNoTouchList.displayName = "StyledNoTouchList";

export const StyledNoTouchListLine = styled.li`
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1.57;
    & + & {
        margin-top: 8px;
    }
`;
StyledNoTouchListLine.displayName = "StyledNoTouchListLine";

export const StyledNoTouchListIcon = styled(SWReactIcons)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 20px;
    height: 24px;
    margin-right: 7px;
    svg {
        width: 10px;
        height: 10px;
    }
    path {
        fill: #aab2ba;
    }
`;
StyledNoTouchListIcon.displayName = "StyledNoTouchListIcon";
