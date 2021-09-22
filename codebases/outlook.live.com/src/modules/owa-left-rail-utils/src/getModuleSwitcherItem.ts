import getModuleSwitcherItemUrl from './getModuleSwitcherItemUrl';
import type { IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import { Module } from 'owa-workloads';
import type { IIconProps } from '@fluentui/react/lib/Icon';
import { onModuleClick } from './index';
import { isModuleSwitchEnabled } from './isModuleSwitchEnabled';

export default function getModuleSwitcherItem(
    moduleType: Module,
    selectedModule: Module,
    displayName: string,
    iconProps: IIconProps,
    activeModuleAction: (ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>) => void,
    openInNewTab?: boolean
): IOverflowSetItemProps {
    return {
        key: displayName,
        iconProps: {
            ...iconProps,
            styles: {
                root: { fontSize: 16 },
            },
        },
        text: displayName,
        title: displayName,
        ariaLabel: displayName,
        name: displayName,
        workload: moduleType,
        isSelected: moduleType === selectedModule,
        url: getModuleSwitcherItemUrl(moduleType),
        onClick: () => {
            onModuleClick(moduleType, selectedModule, activeModuleAction);
        },
        openInNewTab: openInNewTab,
        renderAsButton: isModuleSwitchEnabled(selectedModule, moduleType),
    };
}
