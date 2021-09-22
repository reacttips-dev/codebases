import React from "react";
import { SWReactIcons } from "@similarweb/icons";

type CollapseToggleArrowProps = {
    disabled: boolean;
    collapsed: boolean;
    dataAutomation: string;
    className?: string;
    onClick(): void;
};

const CollapseToggleArrow: React.FC<CollapseToggleArrowProps> = ({
    onClick,
    className = null,
    dataAutomation,
    collapsed,
}) => {
    return (
        <div
            onClick={onClick}
            className={className}
            data-collapsed={collapsed}
            data-automation={dataAutomation}
        >
            <SWReactIcons size="sm" iconName="chev-down" />
        </div>
    );
};

export default CollapseToggleArrow;
