import * as React from "react";
import ExpandableList from "components/ExpandableList";
import {TabItemProps} from "./TabItem";
import {ProductDetailTabId} from "Decide/pages/ProductDetailPage/components/ProductDetailTab";

export interface VerticalTabsProps {
    filteredTabItems: Array<React.ReactElement<TabItemProps>>;
    scrollIntoViewTabId?: string;
    className?: string;
}

export const buildDefaultExpandableState = (filteredTabItems: Array<React.ReactElement<TabItemProps>>) => {
    const defaultExpandableState: {[key: string]: boolean} = {};
    filteredTabItems.forEach((tab) => {
        const tabName = tab.props.id;
        if (tabName === ProductDetailTabId.MoreInfo) {
            defaultExpandableState[tabName] = true;
        } else {
            defaultExpandableState[tabName] = false;
        }
    });

    return defaultExpandableState;
};

const VerticalTabs: React.FC<VerticalTabsProps> = ({filteredTabItems, scrollIntoViewTabId, className}) => {
    const [expandableState, setExpandableState] = React.useState(buildDefaultExpandableState(filteredTabItems));

    React.useEffect(() => {
        if (scrollIntoViewTabId) {
            setExpandableState({
                ...expandableState,
                [scrollIntoViewTabId]: true,
            });
        }
    }, [scrollIntoViewTabId]);

    const handleExpandableChange = (changedExpandableTab: string) => {
        setExpandableState({
            ...expandableState,
            [changedExpandableTab]: !expandableState[changedExpandableTab],
        });
    };

    return (
        <>
            {filteredTabItems.map((childElement: React.ReactElement<TabItemProps>, index: number) => (
                <ExpandableList
                    className={className}
                    title={childElement.props.tabLabel}
                    ariaLabel={childElement.props.tabLabel}
                    content={childElement}
                    hasTopBorder={true}
                    data-automation="product-detail-tab-container"
                    key={`expandable-list-${index}`}
                    onClick={() => handleExpandableChange(childElement.props.id)}
                    open={expandableState[childElement.props.id]}
                />
            ))}
        </>
    );
};

export default VerticalTabs;
