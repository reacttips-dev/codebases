import * as React from "react";
import * as PropTypes from "prop-types";
import I18n from "../Filters/I18n";
import { StatelessComponent } from "react";
import * as classNames from "classnames";
import * as _ from "lodash";

export type simpleLegendItem = {
    name: string;
    color: string;
    icon: string;
    isDisabled: boolean;
};

export type simpleLegendProps = {
    items: simpleLegendItem[];
    onItemClicked?(item: React.ReactElement<any>): void;
    LegendItemComponent?: React.Component;
    className?: string;
};

const LegendItemComponent = ({ name, color, icon, isDisabled = false, onClick }) => {
    return (
        <li
            className={classNames("simple-legend-item", { disabled: isDisabled })}
            onClick={onClick}
        >
            <div className="legend-icon-container">
                {icon && <img className="legend-icon-image" src={icon} />}
                {color && (
                    <span
                        className="legend-item-color-marker"
                        style={{ backgroundColor: color }}
                    ></span>
                )}
            </div>
            {name && <I18n className="legend-item-text">{name}</I18n>}
        </li>
    );
};

const SimpleLegend: StatelessComponent<any> = ({
    items,
    onItemClicked,
    className,
    LegendItemComponent,
}) => {
    return (
        <ul
            data-is-toggable={onItemClicked !== _.noop}
            className={classNames("simple-legend", className)}
        >
            {items.map((item, index) => (
                <LegendItemComponent key={index} {...item} onClick={() => onItemClicked(item)} />
            ))}
        </ul>
    );
};

SimpleLegend.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            color: PropTypes.string,
            icon: PropTypes.string,
            isDisabled: PropTypes.bool,
        }),
    ).isRequired,
    onItemClicked: PropTypes.func,
    LegendItemComponent:
        PropTypes.func /* in case you want to provide your own implementation for the legend item */,
};

SimpleLegend.defaultProps = {
    onItemClicked: _.noop,
    LegendItemComponent,
};

export default SimpleLegend;
