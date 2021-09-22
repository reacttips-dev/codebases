import * as React from "react";

import {classIf, classname} from "utils/classname";

import * as styles from "./style.css";
import {TabItemProps} from "./TabItem";
import {hasTabData} from "./utils";
import {TabsProps} from "./Tabs";

export interface HorizontalTabsProps extends Pick<TabsProps, "scrollIntoViewTabId"> {
    children: React.PropsWithChildren<TabItemProps>;
    className?: string;
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({children, scrollIntoViewTabId, className}) => {
    const [currentTab, setCurrentTab] = React.useState<string>();
    const [defaultTab, setDefaultTab] = React.useState<string>();

    const filteredTabItems = React.Children.toArray(children).filter(hasTabData);

    React.useEffect(() => {
        if (filteredTabItems.length) {
            const firstTabItemItem = filteredTabItems[0] as React.ReactElement<TabItemProps>;
            const moreInfoTabId = firstTabItemItem.props.id;
            if (defaultTab !== moreInfoTabId) {
                setDefaultTab(moreInfoTabId);
                setCurrentTab(moreInfoTabId);
            }
        }
    }, [filteredTabItems]);

    React.useEffect(() => {
        if (scrollIntoViewTabId) {
            setCurrentTab(scrollIntoViewTabId);
        }
    }, [scrollIntoViewTabId]);

    return (
        <>
            <div className={classname([styles.container, className])} data-automation="product-detail-tab-container">
                {React.Children.toArray(children).map((element: React.ReactElement<TabItemProps>) => (
                    <button
                        className={classname([
                            styles.tabButton,
                            classIf(styles.tabButtonActive, element.props.id === currentTab),
                        ])}
                        key={element.props.id}
                        onClick={() => setCurrentTab(element.props.id)}
                        data-automation="product-detail-tab"
                        id={element.props.id}>
                        <h2 className={styles.tabButtonHeader}>{element.props.tabLabel}</h2>
                    </button>
                ))}
            </div>
            <div className={styles.containerFluid}>
                <div className={styles.primaryContent}>
                    {React.Children.toArray(children).map((child: React.ReactElement<TabItemProps>) =>
                        React.cloneElement(child, {
                            isActive: child.props.id === currentTab,
                        }),
                    )}
                </div>
            </div>
        </>
    );
};

HorizontalTabs.displayName = "HorizontalTabs";

export default HorizontalTabs;
