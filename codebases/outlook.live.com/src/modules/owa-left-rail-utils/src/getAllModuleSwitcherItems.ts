import { appTasks } from 'owa-locstrings/lib/strings/apptasks.locstring.json';
import { appToDo } from 'owa-locstrings/lib/strings/apptodo.locstring.json';
import { appPeople } from 'owa-locstrings/lib/strings/apppeople.locstring.json';
import { appCalendar } from 'owa-locstrings/lib/strings/appcalendar.locstring.json';
import { appOutlookSpaces } from 'owa-locstrings/lib/strings/appOutlookSpaces.locstring.json';
import { appEventify } from 'owa-locstrings/lib/strings/appEventify.locstring.json';
import { mailAppName } from 'owa-locstrings/lib/strings/mailAppName.locstring.json';
import { appFiles } from 'owa-locstrings/lib/strings/appFiles.locstring.json';
import loc from 'owa-localize';
import type { IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import type * as React from 'react';
import { ControlIcons } from 'owa-control-icons';
import { Module } from 'owa-workloads';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isOutlookSpacesEnabled } from 'owa-timestream-enabled';
import { getModuleForTasks, ModuleForTasks } from 'owa-todo-utils/lib/utils/moduleAccessUtils';
import getModuleSwitcherItem from './getModuleSwitcherItem';
import { getCdnUrl } from 'owa-config';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default function getModuleSwitcherItems(
    selectedModule: Module,
    activeModuleAction?: (ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>) => void
): IOverflowSetItemProps[] {
    const moduleSwitcherItems: IOverflowSetItemProps[] = [
        getModuleSwitcherItem(
            Module.Mail,
            selectedModule,
            loc(mailAppName),
            { iconName: ControlIcons.Mail },
            activeModuleAction
        ),
        getModuleSwitcherItem(
            Module.Calendar,
            selectedModule,
            loc(appCalendar),
            { iconName: ControlIcons.Calendar },
            activeModuleAction
        ),
        getModuleSwitcherItem(
            Module.People,
            selectedModule,
            loc(appPeople),
            { iconName: ControlIcons.People },
            activeModuleAction
        ),
    ];

    if (isFeatureEnabled('doc-fileshub')) {
        moduleSwitcherItems.push(
            getModuleSwitcherItem(
                Module.FilesHub,
                selectedModule,
                loc(appFiles),
                { iconName: ControlIcons.Attach },
                activeModuleAction
            )
        );
    }

    // user may have access to To Do module OR legacy Tasks module OR neither,
    // depending on user type and cutover status
    const module = getModuleForTasks();
    if (module === ModuleForTasks.ToDo) {
        moduleSwitcherItems.push(
            getModuleSwitcherItem(
                Module.Tasks,
                selectedModule,
                loc(appToDo),
                { iconName: ControlIcons.ToDoLogoOutline },
                activeModuleAction,
                isHostAppFeatureEnabled('toDoNewTab')
            )
        );
    } else if (module === ModuleForTasks.LegacyTasks) {
        moduleSwitcherItems.push(
            getModuleSwitcherItem(
                Module.Tasks,
                selectedModule,
                loc(appTasks),
                { iconName: ControlIcons.CheckboxComposite },
                activeModuleAction,
                isHostAppFeatureEnabled('toDoNewTab')
            )
        );
    }

    if (isOutlookSpacesEnabled() && !isFeatureEnabled('cal-board-linkForwarding')) {
        moduleSwitcherItems.push(
            getModuleSwitcherItem(
                Module.OutlookSpaces,
                selectedModule,
                loc(appOutlookSpaces),
                { iconName: ControlIcons.NotePinned },
                activeModuleAction
            )
        );
    }

    if (isFeatureEnabled('eventify-includeInModuleSwitcher')) {
        moduleSwitcherItems.push(
            getModuleSwitcherItem(
                Module.Eventify,
                selectedModule,
                loc(appEventify),
                {
                    imageProps: {
                        src: `${getCdnUrl()}assets/eventify/logo/24.svg`,
                        width: 16,
                        height: 16,
                        shouldFadeIn: false,
                    },
                },
                activeModuleAction
            )
        );
    }

    return moduleSwitcherItems;
}
