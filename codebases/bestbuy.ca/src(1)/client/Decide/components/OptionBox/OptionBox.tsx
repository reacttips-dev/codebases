import * as React from "react";

import {classname, ClassnamesTypes} from "utils/classname";

import * as styles from "./styles.css";

interface Props {
    children: React.ReactNode;
    isSelected: boolean;
    dataAutomation?: string;
    onClick?: (evt: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    disabled?: boolean;
}

const OptionBox: React.SFC<Props> = ({
    className = "",
    dataAutomation,
    isSelected,
    onClick,
    children,
    disabled,
}: Props) => {
    const cssClasses: ClassnamesTypes = [styles.optionBox, className];

    if (!disabled) {
        cssClasses.push({[styles.isSelected]: isSelected});
    } else {
        cssClasses.push(styles.disabled);
    }
    return (
        <div
            className={classname(cssClasses)}
            data-automation={`${dataAutomation || ""}${(isSelected && " is-selected") || ""}`}
            role="button"
            onClick={(evt) => {
                if (disabled) {
                    evt.preventDefault();
                    return;
                }
                if (onClick && typeof onClick === "function") {
                    onClick(evt);
                }
            }}>
            {children}
        </div>
    );
};

export default OptionBox;
