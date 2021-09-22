import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import { StatelessComponent } from "react";

const Switcher: StatelessComponent<any> = ({
    items,
    onItemClicked,
    selectedItem,
    selectedIndex,
    className,
    ...otherProps
}) => {
    return (
        <ul
            className={classNames("react-switcher u-flex-row u-flex-center", className)}
            {...otherProps}
        >
            {items.map((item, index) => {
                let isSelected = item === selectedItem || index === selectedIndex;
                return (
                    <li key={index} onClick={() => !isSelected && onItemClicked(item, index)}>
                        {React.cloneElement(item, {
                            className: classNames(item.props.className, { selected: isSelected }),
                        })}
                    </li>
                );
            })}
        </ul>
    );
};

Switcher.propTypes = {
    items: PropTypes.arrayOf(PropTypes.element).isRequired,
    onItemClicked: PropTypes.func.isRequired,
    selectedItem: PropTypes.element,
    selectedIndex: PropTypes.number,
};

export default Switcher;
