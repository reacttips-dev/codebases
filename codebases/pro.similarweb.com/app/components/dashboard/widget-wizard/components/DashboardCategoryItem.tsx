import * as classNames from "classnames";
import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import * as React from "react";

export interface IDashboardCategoryItem {
    id: string;
    onClick?: (event) => void;
    selected?: boolean;
    disabled?: boolean;
    icon?: string;
    className?: string;
    count?: string;
}

export const DashboardCategoryItem: StatelessComponent<IDashboardCategoryItem> = ({
    onClick,
    selected,
    icon,
    className,
    children,
    disabled,
    count,
}) => {
    const itemText = count ? `${children} (${count})` : `${children}`;
    return (
        <div
            className={classNames("DropdownItem", className, {
                "DropdownItem--disabled": disabled,
                "DropdownItem--selected": selected,
                categoryChildItem: !icon && children !== "All Categories",
            })}
            onClick={onClick}
        >
            {icon ? <i className={classNames(icon, "DropdownItem-icon")} /> : null}
            {itemText}
            {selected ? <span className="icon icon-checked DropdownItem--selected-check" /> : null}
        </div>
    );
};

DashboardCategoryItem.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    count: PropTypes.string,
    className: PropTypes.string,
};

DashboardCategoryItem.displayName = "DashboardCategoryItem";

export default DashboardCategoryItem;
