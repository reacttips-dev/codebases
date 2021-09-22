import React from "react";
import { TechnologiesDDTabsProps } from "../components/common/TechnologiesDDTabs/TechnologiesDDTabs";

type ExpectedConsumerProps = TechnologiesDDTabsProps;

type ExpectedHOCProps = {
    isSearchEmpty: boolean;
};

const withTechnologySmartTabs = <PROPS extends ExpectedConsumerProps>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithTechnologySmartTabs(props: PROPS & ExpectedHOCProps) {
        const { isSearchEmpty, tabs, ...rest } = props;
        const [selectedTabIndex, selectTabIndex] = React.useState(0);

        React.useEffect(() => {
            const isPossibleToMove = selectedTabIndex < tabs.length - 1;

            if (!isPossibleToMove || isSearchEmpty) {
                return;
            }

            const shouldMoveToNextTabWithResults =
                tabs[selectedTabIndex].items.length === 0 &&
                tabs.some((tab) => tab.items.length > 0);

            if (!shouldMoveToNextTabWithResults) {
                return;
            }

            selectTabIndex(getNextTabIndexWithResults(selectedTabIndex, tabs));
        }, [tabs]);

        function getNextTabIndexWithResults(index, tabs) {
            if (tabs[index].items.length > 0) {
                return index;
            }

            return getNextTabIndexWithResults(index + 1, tabs);
        }

        return (
            <ConsumerComponent
                {...((rest as unknown) as PROPS)}
                onTabSelect={selectTabIndex}
                selectedTabIndex={selectedTabIndex}
                tabs={tabs.map((tab) => ({ ...tab, isDisabled: tab.items.length === 0 }))}
            />
        );
    }

    return WrappedWithTechnologySmartTabs as React.ComponentType<
        ExpectedHOCProps & Omit<ExpectedConsumerProps, "selectedTabIndex" | "onTabSelect">
    >;
};

export default withTechnologySmartTabs;
