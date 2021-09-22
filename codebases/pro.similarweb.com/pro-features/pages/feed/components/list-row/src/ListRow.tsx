import {
    ClosableLegendItemComponent,
    SimpleLegend,
} from "@similarweb/ui-components/dist/simple-legend";
import * as classNames from "classnames";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import "../styles/ListRow.scss";

export interface IListRowProps {
    id?: string | number;
    icon?: string;
    text: string;
    isSelected?: boolean;
    isSuggested?: boolean;
    isUnderlined?: boolean;
    isHoverable?: boolean;
    onClick?: (param?) => void;
    onCloseClick?: (param?) => void;
    isClosable?: boolean;
    className?: string;
    rightIcon?: string;
    listHeight?: number | string;
}

export const ListRow: StatelessComponent<IListRowProps> = ({
    id,
    icon,
    text,
    isSuggested,
    isSelected,
    isUnderlined,
    isClosable,
    onClick,
    isHoverable,
    className,
    rightIcon,
    listHeight,
    onCloseClick,
}) => {
    const classes = classNames(
        "ListRow",
        "u-flex-row",
        "u-flex-center",
        "u-flex-space-between",
        className,
        {
            "ListRow--suggested": isSuggested,
            "ListRow--selected": isSelected,
            "ListRow--hoverable": isHoverable,
            "ListRow--closable": isClosable,
        },
    );
    return (
        <div className={classes} style={{ height: listHeight }}>
            <span className="ListRow-legendBlock u-flex-row u-flex-center">
                {isClosable ? (
                    <SimpleLegend
                        items={[{ icon, name: text }]}
                        onItemClicked={onClick}
                        LegendItemComponent={(props) => (
                            <ClosableLegendItemComponent
                                {...props}
                                item={props}
                                onClose={onCloseClick}
                            />
                        )}
                    />
                ) : (
                    <SimpleLegend items={[{ icon, name: text }]} />
                )}
                {/*<div className="ListRow-text" style={{lineHeight: `${listHeight}px`}} onClick={onClick}>{text}</div>*/}
            </span>
            <img className="ListRow-rightIcon" src={rightIcon} />
        </div>
    );
};

ListRow.defaultProps = {
    text: "list row",
    isSuggested: false,
    isSelected: false,
    isUnderlined: false,
    isHoverable: false,
    onClick: () => _.noop,
    onCloseClick: () => _.noop,
    className: "",
    listHeight: 48,
    isClosable: false,
};

ListRow.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    isSuggested: PropTypes.bool,
    isHoverable: PropTypes.bool,
    onClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    className: PropTypes.string,
    isClosable: PropTypes.bool,
    rightIcon: PropTypes.string,
    listHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isUnderlined: PropTypes.bool,
};

ListRow.displayName = "ListRow";
