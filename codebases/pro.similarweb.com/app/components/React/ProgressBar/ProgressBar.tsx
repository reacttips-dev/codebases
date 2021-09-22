import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

import { InjectableComponentClass } from "../InjectableComponent/InjectableComponent";
interface ProgressBarProps {
    width: number;
    height?: number;
    className?: string;
    backgroundColor?: string;
    isCompare?: boolean;
    innerColor?: string;
}

export class ProgressBar extends InjectableComponentClass<ProgressBarProps, {}> {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        backgroundColor: PropTypes.string,
        innerColor: PropTypes.string,
        isCompare: PropTypes.bool,
    };

    render() {
        const isCompare = !!this.props.isCompare;
        const { backgroundColor, height, width, innerColor } = this.props;
        return (
            <div
                className={classNames(
                    "sw-progress-bar",
                    { "sw-progress-bar--compare": isCompare },
                    this.props.className,
                )}
                style={{ backgroundColor, height }}
            >
                <div
                    className={classNames("sw-progress-bar-inner", { "very-long": width >= 98.3 })}
                    style={{
                        // Add 0.5px in case that width > 0 so that width would not floor to 0 in small columns
                        width: width ? `calc(${width}% + 0.5px)` : 0,
                        backgroundColor: innerColor,
                    }}
                />
            </div>
        );
    }
}
