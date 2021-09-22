import * as React from "react";
import * as classNames from "classnames";

export const Checkbox: any = ({ label, onClick, isDisabled = false, selected }) => {
    return (
        <div className={classNames("checkbox-container", { disabled: isDisabled })}>
            <div
                className={classNames(
                    "checkbox-icon-container",
                    { disabled: isDisabled },
                    { selected: selected },
                )}
                onClick={onClick}
            >
                {selected && (
                    <i className={classNames("sw-icon-checkmark", { disabled: isDisabled })} />
                )}
            </div>
            <label className={classNames("checkbox-label")}>{label}</label>
        </div>
    );
};
