import * as classNames from "classnames";
import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import * as React from "react";

export const TopBarItem: StatelessComponent<any> = ({
    index,
    onClick,
    customClass,
    className,
    children,
    bgColor,
    hoverText,
}) => {
    let backgroundClass = "topbar-item-background";
    if (hoverText) {
        backgroundClass = "topbar-item-background-hover-text";
    }
    return (
        <div
            onClick={() => {
                onClick(index);
            }}
            className={classNames("topbar-item", customClass, className)}
        >
            <span className="topbar-item-text">{children}</span>
            <span className={backgroundClass} style={{ backgroundColor: bgColor }}>
                {hoverText}
            </span>
        </div>
    );
};

TopBarItem.propTypes = {
    className: PropTypes.string,
};

TopBarItem.displayName = "TopBarItem";
