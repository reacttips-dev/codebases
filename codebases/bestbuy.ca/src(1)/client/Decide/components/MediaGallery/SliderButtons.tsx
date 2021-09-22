import * as React from "react";
import {ChevronRight, ChevronLeft} from "@bbyca/bbyca-components";

import {classname, classIf} from "utils/classname";

import * as styles from "./style.css";

interface ArrowProps {
    className?: string;
    onClick?: () => void;
    disabled?: any;
}

export const NextArrow: React.FC<ArrowProps> = ({className, onClick, disabled}) => (
    <button onClick={onClick} className={classname(styles.button)}>
        <ChevronRight
            className={classname([className, styles.icon, styles.sliderNextArrow, classIf(styles.disabled, disabled)])}
        />
    </button>
);

export const PrevArrow: React.FC<ArrowProps> = ({className, onClick, disabled}) => (
    <button onClick={onClick} className={classname(styles.button)}>
        <ChevronLeft
            className={classname([className, styles.icon, styles.sliderPrevArrow, classIf(styles.disabled, disabled)])}
        />
    </button>
);
