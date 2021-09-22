import * as React from "react";
import { StyledNoTouchPanel, StyledNoTouchPanelIcon } from "./StyledComponents";

export interface INoTouchPanelProps {
    isActive?: boolean;
}

const NoTouchPanel: React.FunctionComponent<INoTouchPanelProps> = ({ children, isActive }) => (
    <StyledNoTouchPanel isActive={isActive}>
        {isActive && <StyledNoTouchPanelIcon iconName="checked" />}
        {children}
    </StyledNoTouchPanel>
);

export default NoTouchPanel;
