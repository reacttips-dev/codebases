// The modules supported by module switcher.
export enum Module {
    Mail = 'Mail',
    Calendar = 'Calendar',
    People = 'People',
    FilesHub = 'FilesHub',
    Tasks = 'Tasks',
    OutlookSpaces = 'OutlookSpaces',
    Eventify = 'Eventify',
    PublishedCalendar = 'PublishedCalendar',
    MailDeepLink = 'MailDeepLink',
    OrgExplorer = 'OrgExplorer',
    AppHost = 'AppHost',
    CalendarDeepLink = 'CalendarDeepLink',
}

// This is all the modules that are enabled to use the shared bootstrap code of
// appBootstrap
export type ModulesEnabledForAppBootstrap = Extract<
    Module,
    | Module.Mail
    | Module.Calendar
    | Module.People
    | Module.FilesHub
    | Module.OutlookSpaces
    | Module.MailDeepLink
    | Module.OrgExplorer
    | Module.AppHost
    | Module.CalendarDeepLink
>;

// This list all the modules that are enabled for switching within the same load of the page
// without a url redirect
export type ModulesEnabledForSwitch = Extract<
    Module,
    Module.Mail | Module.Calendar | Module.People | Module.FilesHub | Module.AppHost
>;
