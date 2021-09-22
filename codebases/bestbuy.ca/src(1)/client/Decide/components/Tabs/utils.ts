import {Children, ReactElement} from "react";
import {TabItemProps} from "./TabItem";

export const hasTabData = (tabItem: ReactElement<TabItemProps>): boolean => {
    const tabItemChildren = Children.toArray(tabItem.props.children);
    return !!tabItemChildren.length;
};
