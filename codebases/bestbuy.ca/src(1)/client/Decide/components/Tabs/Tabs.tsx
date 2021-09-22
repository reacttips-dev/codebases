import * as React from "react";

import SectionTitle from "components/SectionTitle";
import * as styles from "./style.css";
import HorizontalTabs from "./HorizontalTabs";
import {TabItemProps} from "./TabItem";
import {hasTabData} from "./utils";
import VerticalTabs from "./VerticalTabs";
import {classname} from "utils/classname";

export interface TabsProps {
    children: React.ReactElement<TabItemProps> | Array<React.ReactElement<TabItemProps>>;
    scrollIntoViewTabId?: string;
    tabStyle?: TabStyle;
    className?: string;
}

export enum TabStyle {
    vertical = "vertical",
    horizontal = "horizontal",
}

export const Tabs: React.FC<TabsProps> = ({children, scrollIntoViewTabId, tabStyle, className}) => {
    const filteredTabItems = React.Children.toArray(children).filter(hasTabData);
    if (tabStyle === TabStyle.vertical) {
        return (
            <VerticalTabs
                filteredTabItems={filteredTabItems}
                scrollIntoViewTabId={scrollIntoViewTabId}
                className={className}
            />
        );
    } else if (tabStyle === TabStyle.horizontal) {
        return (
            <HorizontalTabs scrollIntoViewTabId={scrollIntoViewTabId} className={className}>
                {filteredTabItems}
            </HorizontalTabs>
        );
    }
    return (
        <>
            {filteredTabItems.map((childElement: React.ReactElement, index: number) => {
                return (
                    <div
                        key={index}
                        className={classname([styles.tabSection, className])}
                        data-automation="product-detail-tab-container">
                        <SectionTitle className={styles.tabHeading}>{childElement.props.tabLabel}</SectionTitle>
                        {childElement}
                    </div>
                );
            })}
        </>
    );
};

export default Tabs;
