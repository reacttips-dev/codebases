import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { OverflowSet, IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import * as React from 'react';
import getAllModuleSwitcherItems from 'owa-left-rail-utils/lib/getAllModuleSwitcherItems';
import { onModuleClick } from 'owa-left-rail-utils';
import { Module } from 'owa-workloads';
import { LeftRailItem } from 'owa-left-rail-item';
import OverflowButton from './OverflowButton';

import styles from './ModuleSwitcher.scss';

export interface ModuleSwitcherProps extends React.HTMLAttributes<HTMLAnchorElement> {
    selectedModule: Module;
    containerWidth: number; // Specify container width if module switcher is horizontal for number of button calculations.
    /**
     * The action to call when the item is clicked and it also represents the active module.
     * - (eg, clicking mail while in mail)
     */
    activeModuleAction?: (
        ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>
    ) => void;
}

export default observer(function ModuleSwitcher(props: ModuleSwitcherProps) {
    const { selectedModule, containerWidth, activeModuleAction } = props;
    const moduleSwitcherItems = useComputed((): IOverflowSetItemProps[] => {
        return getAllModuleSwitcherItems(props.selectedModule, props.activeModuleAction);
    });

    const renderItem = (item: IOverflowSetItemProps) => {
        const onClick = () => {
            onModuleClick(item.workload, selectedModule, activeModuleAction);
        };
        return (
            <LeftRailItem
                iconProps={item.iconProps}
                item={item.workload}
                text={item.text}
                isSelected={item.workload === selectedModule}
                isHorizontal={true}
                url={item.url}
                onClick={onClick}
                openInNewTab={item.openInNewTab}
                selectedModule={selectedModule}
                renderAsButton={item.renderAsButton}
            />
        );
    };
    const containerAriaProps: AriaProperties = {
        role: AriaRoles.menubar,
        orientation: 'horizontal',
    };
    let buttonsToShow = moduleSwitcherItems.get();
    let overflowItems = [];
    // Get the number of buttons that fit within container (minus the overflow button width)
    const numButtons = Math.floor(containerWidth / 48 /* moduleButtonSize */);
    if (numButtons < moduleSwitcherItems.get().length) {
        // Subtract 1 to account for the overflow button
        buttonsToShow = moduleSwitcherItems.get().slice(0, numButtons - 1);
        overflowItems = moduleSwitcherItems.get().slice(numButtons - 1);
    }
    return (
        <OverflowSet
            className={styles.horizontalContainer}
            vertical={false}
            items={buttonsToShow}
            overflowItems={overflowItems}
            onRenderItem={renderItem}
            onRenderOverflowButton={renderOverflowItem}
            {...generateDomPropertiesForAria(containerAriaProps)}
            styles={{
                root: { minWidth: containerWidth },
                item: styles.overflowSetItem,
            }}
        />
    );
});

function renderOverflowItem(overflowItems: IOverflowSetItemProps[]) {
    return <OverflowButton overflowItems={overflowItems} />;
}
