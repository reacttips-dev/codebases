import * as React from "react";

import SWReactRootComponent from "decorators/SWReactRootComponent";
export const ToggleSwitch: any = ({ id, toggle, onToggle, isDisabled }) => {
    return (
        <div
            className={`toggle-switch ${toggle ? "toggle-switch--on" : "toggle-switch--off"} ${
                isDisabled ? "toggle-switch--disabled" : ""
            }`}
            onClick={(e) => (isDisabled ? () => {} : onToggle(id))}
        ></div>
    );
};
SWReactRootComponent(ToggleSwitch, "ToggleSwitch");
