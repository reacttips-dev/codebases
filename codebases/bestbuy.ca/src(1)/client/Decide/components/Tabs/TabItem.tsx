import * as React from "react";
import {classIf, classname} from "utils/classname";
import * as styles from "./style.css";

interface IntrinsicProps {
    isActive?: boolean;
}
export interface TabItemProps {
    children?: React.ReactNode;
    tabLabel: string;
    className?: string;
    dataAutomation?: string;
    id: string;
    fullWidth?: boolean;
}

export const TabItem: React.FC<TabItemProps & IntrinsicProps> = ({
    tabLabel,
    id,
    children,
    className,
    dataAutomation,
    isActive = false,
    fullWidth = false,
}) => (
    <div
        className={classname([
            className,
            styles.tabItemContainer,
            classIf(styles.isActive, isActive),
            classIf(styles.fullWidth, fullWidth),
        ])}
        data-automation={dataAutomation}
        id={id}
        key={tabLabel}>
        {children}
    </div>
);

TabItem.displayName = "TabItem";

export default TabItem;
