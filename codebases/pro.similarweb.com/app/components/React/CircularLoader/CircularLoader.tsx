import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import * as _ from "lodash";
import SWReactRootComponent from "decorators/SWReactRootComponent";

const defaultOptions = {
    svg: {
        cx: "14",
        cy: "14",
        r: "10",
        stroke: "#ffffff",
        strokeWidth: "3",
        fill: "none",
    },
    style: {
        width: "30px",
        height: "30px",
    },
    className: "",
};
let Loader: React.StatelessComponent<any> = ({ options: propsOptions }) => {
    const options = _.merge({}, defaultOptions, propsOptions);
    return (
        <svg className={classNames("circularLoader-svg", options.className)} style={options.style}>
            <circle
                className="circularLoader-circle"
                cx={options.svg.cx}
                cy={options.svg.cy}
                r={options.svg.r}
                stroke={options.svg.stroke}
                strokeWidth={options.svg.strokeWidth}
                fill={options.svg.fill}
            ></circle>
        </svg>
    );
};

Loader.defaultProps = {
    options: {},
};
Loader.propTypes = {
    options: PropTypes.object,
};

SWReactRootComponent(Loader, "Loader");

export const CircularLoader = Loader;
