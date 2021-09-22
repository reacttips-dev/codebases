/**
 * Created by olegg on 15-May-17.
 */
import * as React from "react";
import * as _ from "lodash";
import Switcher from "./Switcher";
import { StatelessComponent } from "react";
import { RadioButton } from "./RadioButton";
import * as PropTypes from "prop-types";
import { PlainTooltip } from "../Tooltip/PlainTooltip/PlainTooltip";
//import SWReactRootComponent from "decorators/SWReactRootComponent";

export const RadioSwitcher: StatelessComponent<any> = ({
    items,
    onChange,
    selectedValue,
    ...otherProps
}) => {
    RadioSwitcher.displayName = "RadioSwitcher";
    //SWReactRootComponent(RadioSwitcher);
    const radioItems = items.map((item) => {
        const RadioItem = (
            <div>
                <RadioButton
                    itemSelected={selectedValue === item.value}
                    itemLabel={item.label}
                    itemDisabled={item.isDisabled}
                />
            </div>
        );
        if (item.tooltip) {
            return (
                <PlainTooltip
                    text={item.tooltip}
                    placement="bottom"
                    maxWidth={350}
                    cssClass="PlainTooltip-element plainTooltip-white"
                >
                    {RadioItem}
                </PlainTooltip>
            );
        } else {
            return RadioItem;
        }
    });

    const selectedIndex = _.findIndex(items, { value: selectedValue });

    return (
        <Switcher
            items={radioItems}
            selectedIndex={selectedIndex}
            onItemClicked={(el, index) => onChange(items[index].value)}
            {...otherProps}
        />
    );
};

RadioSwitcher.propTypes = {
    onChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            isDisabled: PropTypes.bool,
            tooltip: PropTypes.string,
        }),
    ),
};
