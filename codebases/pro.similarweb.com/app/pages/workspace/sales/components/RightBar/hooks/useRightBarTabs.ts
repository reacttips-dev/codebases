import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import React from "react";
import { RightBarTabs } from "pages/workspace/sales/components/RightBar/types";
import { RIGHT_BAR_TABS } from "pages/workspace/sales/components/RightBar/helpers";

const useRightBarTabs = () => {
    const isContactsFeatureEnabled = useSalesSettingsHelper().isContactsFeatureEnabled();

    return React.useMemo(() => {
        const accesses = [
            [RightBarTabs.About, true],
            [RightBarTabs.SiteTrends, true],
            [RightBarTabs.Benchmarks, true],
            [RightBarTabs.Contacts, isContactsFeatureEnabled],
        ];

        const tabs: Array<(active: boolean, onClick: () => void) => JSX.Element> = [];

        for (const [tab, access] of accesses) {
            if (access) {
                tabs.push(RIGHT_BAR_TABS.get(tab as RightBarTabs));
            }
        }
        return tabs;
    }, [isContactsFeatureEnabled]);
};

export default useRightBarTabs;
