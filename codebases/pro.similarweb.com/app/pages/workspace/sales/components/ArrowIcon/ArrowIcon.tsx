import React from "react";
import * as classNames from "classnames";

type ArrowProps = {
    value: number;
};

export function ArrowIcon({ value }: ArrowProps) {
    const iconClasses = classNames("changePercentage-icon", {
        "sw-icon-arrow-up5": value > 0,
        "sw-icon-arrow-down5": value < 0,
    });
    return <i className={iconClasses}></i>;
}
