import * as React from "react";
import {ChevronDown, ChevronUp, Expandable, DisplayDefault} from "@bbyca/bbyca-components";
import * as styles from "./style.css";
import {classname, classIf} from "utils/classname";
export interface ExpandableListProps {
    title: React.ReactNode;
    content: React.ReactNode;
    ariaLabel: string;
    hasTopBorder?: boolean;
    hasBottomBorder?: boolean;
    innerDivLeftPadding?: number;
    open?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const ExpandableList: React.FC<ExpandableListProps> = ({
    open,
    title,
    hasTopBorder,
    content,
    hasBottomBorder,
    className,
}) => (
    <Expandable
        headerText={title}
        open={open}
        openedIcon={<ChevronUp className={styles.expandableIcon} viewBox="0 0 24 24" />}
        closedIcon={<ChevronDown className={styles.expandableIcon} viewBox="0 0 24 24" />}
        className={classname([
            className,
            styles.expandable,
            classIf(styles.topBorder, !!hasTopBorder),
            classIf(styles.bottomBorder, !!hasBottomBorder),
        ])}>
        <DisplayDefault>{content}</DisplayDefault>
    </Expandable>
);

export default ExpandableList;
