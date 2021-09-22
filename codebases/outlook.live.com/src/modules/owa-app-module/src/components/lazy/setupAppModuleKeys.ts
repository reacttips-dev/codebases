import type { KeydownConfig, HotkeyCommand } from 'owa-hotkeys';
import { getHotkeysEnabled } from '../../utils/moduleHotKeys';
import { getModuleForTasks, ModuleForTasks } from 'owa-todo-utils/lib/utils/moduleAccessUtils';
import { Module } from 'owa-workloads';
import { getCurrentModule } from 'owa-app-module-store';
import { isFocusAtStackRoot } from 'owa-calendar-focus-manager';
import { onModuleClick, isModuleSwitchEnabled } from 'owa-left-rail-utils';
import { getOwaUrlWithAddedQueryParameters, getTodoModuleUrl } from 'owa-url';
import { getAppModuleCommands } from 'owa-appmodule-hotkeys';

export function setupAppModuleKeys(): KeydownConfig[] {
    const commands = getAppModuleCommands();

    let configs: KeydownConfig[] = [];
    const currentModule = getCurrentModule();
    if (currentModule != Module.MailDeepLink && currentModule != Module.PublishedCalendar) {
        configs = [
            createConfig(commands.gotoMail, gotoMail),
            createConfig(commands.gotoCalendar, gotoCalendar),
            createConfig(commands.gotoPeople, gotoPeople),
        ];

        if (getModuleForTasks() !== ModuleForTasks.None) {
            configs.push(createConfig(commands.gotoToDo, goToToDo));
        }
    }

    return configs;
}

function createConfig(
    command: HotkeyCommand,
    handler: (evt?: KeyboardEvent) => void
): KeydownConfig {
    return { command, handler, options: { allowHotkeyOnTextFields: true, isEnabled } };
}

function gotoMail() {
    goToModuleKeyCommand(Module.Mail);
}

function gotoCalendar() {
    goToModuleKeyCommand(Module.Calendar);
}

function gotoPeople() {
    goToModuleKeyCommand(Module.People);
}

function goToToDo() {
    goToModuleKeyCommand(Module.Tasks);
}

function goToModuleKeyCommand(newModule: Module) {
    const currentModule = getCurrentModule();
    if (currentModule && isModuleSwitchEnabled(currentModule, newModule)) {
        onModuleClick(newModule, currentModule);
    } else {
        window.location.assign(
            newModule === Module.Tasks && getModuleForTasks() === ModuleForTasks.ToDo
                ? getTodoModuleUrl()
                : getOwaUrlWithAddedQueryParameters({ path: '/' + newModule.toLowerCase() })
        );
    }
}

function isEnabled() {
    // we want to disable hotkeys if there are any fabric popups open, not just ones the surface owns, so check for those separately
    return getCurrentModule() != Module.Calendar || (getHotkeysEnabled() && isFocusAtStackRoot());
}
