import { canShowToDoModule } from 'owa-todo-utils/lib/utils/moduleAccessUtils';
import {
    getMailPath,
    getCalendarPath,
    getPeoplePath,
    getFilesHubPath,
    getOutlookSpacesPath,
    getOwaUrlWithAddedQueryParameters,
    getEventifyPath,
    getTodoModuleUrl,
} from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { Module } from 'owa-workloads';

export default function getModuleSwitcherItemURL(workload: Module): string {
    const search = getHostLocation().search;
    switch (workload) {
        case Module.Mail:
            return getMailPath() + search;
        case Module.Calendar:
            return getCalendarPath() + search;
        case Module.People:
            return getPeoplePath() + search;
        case Module.FilesHub:
            return getFilesHubPath() + search;
        case Module.Tasks:
            return canShowToDoModule()
                ? getTodoModuleUrl()
                : getOwaUrlWithAddedQueryParameters({ path: '/tasks' });
        case Module.OutlookSpaces:
            return getOutlookSpacesPath() + search;
        case Module.Eventify:
            return getEventifyPath();
        default:
            throw new Error("Cannot get module switcher item URL of a workload that doesn't exist");
    }
}
