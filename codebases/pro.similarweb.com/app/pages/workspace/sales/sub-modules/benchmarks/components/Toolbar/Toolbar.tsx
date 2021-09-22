import React from "react";
import { StyledToolbar, StyledButtonIcon } from "./styles";

type ToolbarProps = {
    onSettingsClick?: () => void;
    children?: React.ReactChild | React.ReactChild[];
};

const Toolbar: React.FC<ToolbarProps> = ({ children, onSettingsClick }) => {
    return (
        <StyledToolbar>
            {children}
            {onSettingsClick && <StyledButtonIcon onClick={onSettingsClick} iconName="settings" />}
        </StyledToolbar>
    );
};

export default Toolbar;
