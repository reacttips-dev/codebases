import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { INoTouchPanelProps } from "./NoTouchPanel";

export const StyledNoTouchPanel: any = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 45px 50px;
    background-color: #fff;
    border: 1px solid ${({ isActive }: INoTouchPanelProps) => (isActive ? "#7975f2" : "#fff")};
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    &:first-child {
        margin-top: 0;
    }
`;
StyledNoTouchPanel.displayName = "StyledNoTouchPanel";

export const StyledNoTouchPanelIcon = styled(SWReactIcons)`
    position: absolute;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    top: -11px;
    right: -11px;
    padding: 4px;
    background-color: #7975f2;
    border-radius: 50%;
    path {
        fill: #fff;
    }
`;
StyledNoTouchPanelIcon.displayName = "StyledNoTouchPanelIcon";

export const StyledNoTouchPanelColumn: any = styled.div`
    flex-basis: 30%;
    flex-shrink: 0;
    &:last-child {
        display: flex;
        justify-content: flex-end;
        flex-shrink: 1;
    }
`;
StyledNoTouchPanelColumn.displayName = "StyledNoTouchPanelColumn";
