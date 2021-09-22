import React, { FC } from "react";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import { ISingleWorkspaceHeaderProps } from "./MarketingWorkspaceNavBarHeaderTypes";

export const SingleWorkspaceHeader: FC<ISingleWorkspaceHeaderProps> = (props) => {
    const handleHeaderClick = () => {
        props.navigator.go("marketingWorkspace-home");
    };

    return <NavBarDefaultHeader text={props.headerTitle} onClick={handleHeaderClick} />;
};
