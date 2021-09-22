/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import { SWReactIcons } from "@similarweb/icons";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import ReactInject from "../../Filters/ReactInject";

const DropDownTitle: StatelessComponent<any> = ({ i18nFilter, ...props }) => {
    if (!props.selectedItem) {
        return null;
    }
    const title = i18nFilter(
        props.selectedItem.getText
            ? props.selectedItem.getText()
            : props.selectedItem.text || props.selectedItem.title,
    );
    return (
        <div
            className="CategoriesDropdownTitle"
            title={title}
            onClick={(event) => props.onSelect(event)}
        >
            <i className={`dropdown-item-icon ${props.selectedItem.icon}`} />
            <span className="CategoriesDropdownTitle-text">{title}</span>
            <span className="dropdownPopup-caret">
                <SWReactIcons iconName="arrow" className="CategoriesDropdownTitle-arrow" />
            </span>
        </div>
    );
};

DropDownTitle.$inject = ["i18nFilter"];

DropDownTitle.defaultProps = {
    trackName: "",
};

DropDownTitle.propTypes = {
    selectedItem: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    trackName: PropTypes.string,
};

export const CategoriesDropdownTitle = ReactInject(DropDownTitle);
