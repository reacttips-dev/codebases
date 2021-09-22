import loc from 'owa-localize';
import {
    goToMailCommand,
    goToCalendarCommand,
    goToPeopleCommand,
    goToToDoCommand,
    goToTasksCommand,
} from './AppModuleHotKeys.locstring.json';
import { canShowToDoModule } from 'owa-todo-utils/lib/utils/moduleAccessUtils';

export const GoToCategory = 'goTo';

export function getAppModuleCommands() {
    return {
        gotoMail: gotoHotkey(goToMailCommand, 'ctrl+shift+1'),
        gotoCalendar: gotoHotkey(goToCalendarCommand, 'ctrl+shift+2'),
        gotoPeople: gotoHotkey(goToPeopleCommand, 'ctrl+shift+3'),
        gotoToDo: gotoHotkey(
            canShowToDoModule() ? goToToDoCommand : goToTasksCommand,
            'ctrl+shift+4'
        ),
    };
}

function gotoHotkey(descriptionResourceId: string, hotkey: string) {
    return {
        category: GoToCategory,
        description: loc(descriptionResourceId),
        hotmail: hotkey,
        yahoo: hotkey,
        gmail: hotkey,
        owa: hotkey,
    };
}
