import * as React from 'react';
import AccountSwitcher from 'owa-account-switcher';
import { isFeatureEnabled } from 'owa-feature-flags';
import { MultiAccountSwitcher } from 'owa-multi-account-switcher';
import { isMultiAccountScenario } from 'owa-left-rail-utils/lib/isMultiAccountScenario';
import { Module } from 'owa-workloads';
import { OverflowSet, IOverflowSetItemProps } from '@fluentui/react/lib//OverflowSet';
import getAllModuleSwitcherItems from 'owa-left-rail-utils/lib/getAllModuleSwitcherItems';
import { LeftRailItem } from 'owa-left-rail-item';

import styles from './ModuleSwitcher.scss';

export interface ModuleSwitcherLeftRailProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedModule: Module;
    /**
     * The action to call when the item is clicked and it also represents the active module.
     * - (eg, clicking mail while in mail)
     */
    activeModuleAction?: (
        ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>
    ) => void;
}

export default function ModuleSwitcherLeftRail(props: ModuleSwitcherLeftRailProps) {
    const { selectedModule, activeModuleAction } = props;

    const renderItem = React.useCallback(
        (item: IOverflowSetItemProps) => {
            return (
                <LeftRailItem
                    iconProps={item.iconProps}
                    item={item.workload}
                    text={item.text}
                    isSelected={item.isSelected}
                    isHorizontal={false}
                    url={item.url}
                    onClick={item.onClick}
                    openInNewTab={item.openInNewTab}
                    selectedModule={selectedModule}
                    renderAsButton={item.renderAsButton}
                />
            );
        },
        [selectedModule]
    );

    return (
        <div className={styles.leftRail}>
            {isFeatureEnabled('auth-cloudCache') && <AccountSwitcher />}
            {isMultiAccountScenario() && selectedModule == Module.Mail && (
                <MultiAccountSwitcher activeAccountAction={activeModuleAction} />
            )}
            <OverflowSet
                vertical={true}
                items={getAllModuleSwitcherItems(selectedModule, activeModuleAction)}
                onRenderItem={renderItem}
                onRenderOverflowButton={null}
                styles={{ root: styles.overflowSetRoot }}
            />
        </div>
    );
}
