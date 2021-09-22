/**
 * Created by olegg on 21-May-17.
 */
import * as React from "react";
import I18n from "../Filters/I18n";
import { StatelessComponent } from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

export interface IRadioButton {
    value: string;
    label: string;
    isDisabled?: boolean;
    tooltip?: string;
}

export const RadioButton: StatelessComponent<any> = ({ itemLabel, itemSelected, itemDisabled }) => {
    return (
        <div
            className={classNames("radio-container u-flex-row u-flex-center", {
                "radio-container--selected": itemSelected && !itemDisabled,
                "radio-container--disabled": itemDisabled,
            })}
        >
            <div className="radio-border" />
            <label className="radio-label-text">
                <I18n>{itemLabel}</I18n>
            </label>
        </div>
    );
};

RadioButton.defaultProps = {
    itemDisabled: false,
    itemSelected: false,
};

RadioButton.propTypes = {
    itemDisabled: PropTypes.bool,
    itemSelected: PropTypes.bool,
    itemLabel: PropTypes.string.isRequired,
};
