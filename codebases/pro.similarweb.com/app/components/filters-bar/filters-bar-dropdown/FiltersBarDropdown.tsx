import * as React from "react";
import * as PropTypes from "prop-types";
import { Dropdown, IDropdownProps } from "@similarweb/ui-components/dist/dropdown";
import "./FiltersBarDropdown.scss";
import { StatelessComponent } from "react";

/**
 * Wrapper for ordinary dropdown component
 * @param {IDropdownProps<any> & {children?: React.ReactNode}} props
 * @returns {any}
 * @constructor
 */
export const FiltersBarDropdown: StatelessComponent<IDropdownProps<any>> = (props) => {
    const newProps = {
        ...props,
        cssClassContainer: `${props.cssClassContainer} DropdownContent-container FiltersBarDropdown`,
    };
    return <Dropdown {...newProps} />;
};

FiltersBarDropdown.displayName = "FiltersBarFilter";

FiltersBarDropdown.defaultProps = {
    cssClassContainer: "",
};
