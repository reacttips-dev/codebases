import * as React from "react";
import { StatelessComponent } from "react";
import { SWReactIcons } from "@similarweb/icons";

export const SettingsButton: StatelessComponent<any> = ({ className = "", onClick }) => {
    return (
        <div onClick={onClick}>
            <SWReactIcons iconName="settings" className={className} />
        </div>
    );
};
SettingsButton.displayName = "SettingsButton";
