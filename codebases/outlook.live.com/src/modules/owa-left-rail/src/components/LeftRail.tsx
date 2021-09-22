import * as React from 'react';
import AccountSwitcher from 'owa-account-switcher';
import { isFeatureEnabled } from 'owa-feature-flags';
import { MultiAccountSwitcher } from 'owa-multi-account-switcher';
import getAllModuleSwitcherItems from 'owa-left-rail-utils/lib/getAllModuleSwitcherItems';
import { isMultiAccountScenario } from 'owa-left-rail-utils/lib/isMultiAccountScenario';
import { Module } from 'owa-workloads';
import { LeftRailItem } from 'owa-left-rail-item';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import initializeSupportedOfficeRailApps from '../utils/initializeSupportedOfficeRailApps';
import { getStore as getLeftRailStore } from 'owa-left-rail-utils/lib/store/store';
import getOfficeAppItemDisplayProperties from 'owa-left-rail-utils/lib/getOfficeAppItemDisplayProperties';
import { observer } from 'mobx-react-lite';

import styles from './LeftRail.scss';

export interface LeftRailProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedModule: Module;
    /**
     * The action to call when the item is clicked and it also represents the active module.
     * - (eg, clicking mail while in mail)
     */
    activeModuleAction?: (
        ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>
    ) => void;
}

export default observer(function LeftRail(props: LeftRailProps) {
    const { selectedModule, activeModuleAction } = props;
    const officeAppItems = getLeftRailStore().enabledRailItems.map(item => {
        return getOfficeAppItemDisplayProperties(item, selectedModule);
    });

    React.useEffect(() => {
        if (!officeAppItems?.length) {
            // Fetch supported apps from getBposNavBarData service and add to store
            initializeSupportedOfficeRailApps();
        }
    }, []);

    const getLeftRailItems = React.useCallback(() => {
        const items = getAllModuleSwitcherItems(selectedModule, activeModuleAction).concat(
            officeAppItems
        );

        return items.map(item => {
            return (
                <LeftRailItem
                    iconProps={item.iconProps}
                    item={item.workload}
                    text={item.text}
                    isSelected={item.isSelected}
                    key={item.key}
                    isHorizontal={false}
                    url={item.url}
                    onClick={item.onClick}
                    openInNewTab={item.openInNewTab}
                    selectedModule={selectedModule}
                    renderAsButton={item.renderAsButton}
                />
            );
        });
    }, [selectedModule, officeAppItems]);

    return (
        <div className={styles.leftRail}>
            {isFeatureEnabled('auth-cloudCache') && <AccountSwitcher />}
            {isMultiAccountScenario() && selectedModule == Module.Mail && (
                <MultiAccountSwitcher activeAccountAction={activeModuleAction} />
            )}
            <FocusZone
                className={styles.leftRailItems}
                direction={FocusZoneDirection.vertical}
                role={'group'}>
                {getLeftRailItems()}
            </FocusZone>
        </div>
    );
});
