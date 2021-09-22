import * as React from "react";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import I18n from "../../Filters/I18n";
import * as classNames from "classnames";
import { StatelessComponent } from "react";

let ButtonContent = ({ text, textClass, iconClass, action }) => {
    return (
        <span className="table-cell-button-content">
            {iconClass ? <i className={classNames("table-cell-button-icon", iconClass)} /> : null}
            {text ? (
                <span className={classNames("table-cell-button-text", textClass)}>
                    <I18n>{text}</I18n>
                </span>
            ) : null}
        </span>
    );
};

const LinkButton: StatelessComponent<any> = (props) => {
    const {
        onClick,
        onMouseEnter = _.noop,
        onMouseLeave = _.noop,
        to,
        target,
        ...restOfProps
    } = props;
    return (
        <a
            href={to}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            target={target}
            className="table-cell-button table-cell-button-link"
        >
            <ButtonContent {...restOfProps} />
        </a>
    );
};

LinkButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    to: PropTypes.string.isRequired,
};

LinkButton.defaultProps = {
    onClick: _.noop,
    to: "#",
    target: "_blank",
};

const Button: StatelessComponent<any> = (props) => {
    const { onClick, onMouseEnter = _.noop, onMouseLeave = _.noop, ...restOfProps } = props;
    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="table-cell-button"
        >
            <ButtonContent {...restOfProps} />
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
    onClick: _.noop,
};

export { Button, LinkButton };
