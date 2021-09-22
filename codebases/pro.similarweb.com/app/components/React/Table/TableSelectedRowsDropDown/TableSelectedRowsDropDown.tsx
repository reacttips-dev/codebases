import * as React from "react";
import * as PropTypes from "prop-types";
import { DropDownMenu } from "components/React/DropDownMenu/DropDownMenu";
import * as _ from "lodash";
import { StatelessComponent } from "react";
import * as classNames from "classnames";

const TableSelectedRowsDropDown: StatelessComponent<any> = ({
    trackOnOpen,
    items,
    isDisabled,
    onItemSelected,
    onClear,
    selectedRows,
    placeHolderText,
    showCounter,
    className,
}) => {
    return (
        <div className={classNames("TableSelectedRowsDropDown", className)}>
            {showCounter && !!selectedRows.length && (
                <span className="TableSelectedRowsDropDown-counter selected-count">
                    {selectedRows.length} {"selected "}
                    <i className="sw-icon-selection-remove" onClick={onClear} />
                </span>
            )}
            <div className="TableSelectedRowsDropDown-dropDownContainer">
                <DropDownMenu
                    placeHolder={{ text: placeHolderText }}
                    tracking={{ onOpen: trackOnOpen }}
                    items={items}
                    onItemSelected={onItemSelected}
                    disabled={isDisabled}
                />
            </div>
        </div>
    );
};

TableSelectedRowsDropDown.propTypes = {
    trackOnOpen: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string,
        }),
    ).isRequired,
    isDisabled: PropTypes.bool.isRequired,
    selectedRows: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    placeHolderText: PropTypes.string.isRequired,
    showCounter: PropTypes.bool.isRequired,
};

//TODO: remove inline style objects and allow className to container only
TableSelectedRowsDropDown.defaultProps = {
    onClear: _.noop,
};

export default TableSelectedRowsDropDown;
