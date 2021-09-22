import * as classNames from "classnames";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "../../../../node_modules/@types/react/index";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { DropDownMenu } from "../DropDownMenu/DropDownMenu";
import I18n from "../Filters/I18n";
import { PlainTooltip } from "../Tooltip/PlainTooltip/PlainTooltip";

const CheckBoxList = ({ list }) => {
    const items = Object.keys(list).map((key: any) => {
        const options = list[key];
        const { items, onChange, className, ...otherProps } = options;

        return (
            <div key={key} className={classNames("checkbox-group", className)} {...otherProps}>
                {items.map((item, idx) => (
                    <div key={`${key}_${item.text}`}>
                        <PlainTooltip
                            cssClass={"plainTooltip-element plainTooltip-element--header"}
                            placement={idx === 0 ? "top" : "bottom"}
                            text={item.tooltip}
                            enabled={item.tooltip !== false}
                        >
                            <div>
                                <Checkbox
                                    label={item.text}
                                    onClick={() => onChange({ item, name: key })}
                                    selected={item.isSelected || false}
                                />
                            </div>
                        </PlainTooltip>
                    </div>
                ))}
            </div>
        );
    });
    return <div className="checkbox-list">{items}</div>;
};
const DropDownList = ({ list }) => {
    const items = Object.keys(list).map((dropDownName) => {
        const dropDownConfig = list[dropDownName];
        const { items, selectedItem, onTrack, onItemSelected, ...restOfProps } = dropDownConfig;
        return (
            <DropDownMenu
                key={dropDownName}
                tracking={{ onOpen: onTrack }}
                items={items}
                onItemSelected={(item) => onItemSelected({ name: dropDownName, item })}
                selectedItem={selectedItem}
                {...restOfProps}
            />
        );
    });
    return <div className="dropdowns">{items}</div>;
};

const Filters: StatelessComponent<any> = ({
    checkBoxList,
    dropDownList,
    buttonList,
    ...restOfProps
}) => {
    return (
        <div className="filters-panel" {...restOfProps}>
            <p className="filters-title">
                <I18n>analysis.source.search.keywords.filters.title</I18n>
            </p>
            <div className="filters">
                <div className="checkboxes">
                    <CheckBoxList list={checkBoxList} />
                </div>
                {dropDownList ? (
                    <div className="dropdowns-container">
                        <DropDownList list={dropDownList} />
                    </div>
                ) : null}
                <div className="control-buttons">
                    {buttonList.map((button, key) => React.cloneElement(button, { key }))}
                </div>
            </div>
        </div>
    );
};
Filters.propTypes = {
    buttonList: PropTypes.arrayOf(PropTypes.element).isRequired,
    checkBoxList: PropTypes.objectOf(
        PropTypes.shape({
            onChange: PropTypes.func.isRequired,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    text: PropTypes.string.isRequired,
                    isSelected: PropTypes.bool.isRequired,
                }),
            ).isRequired,
        }),
    ),
    dropDownList: PropTypes.objectOf(
        PropTypes.shape({
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                    text: PropTypes.string.isRequired,
                }),
            ).isRequired,
            selectedItem: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                text: PropTypes.string.isRequired,
            }).isRequired,
            onItemSelected: PropTypes.func.isRequired,
            onTrack: PropTypes.func.isRequired,
        }),
    ),
};

export default Filters;
