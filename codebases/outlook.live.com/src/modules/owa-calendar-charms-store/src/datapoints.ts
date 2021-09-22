export const CHARMS_USAGE_SELECTION_TYPE = 'CharmsUsageBySelectionType';
export const CHARMS_USAGE_GETDEFAULTSET = 'CharmsUsageGetDefaultSet';
export const CHARMS_USAGE_SUGGESTIONS_SHOWN = 'CharmsUsageSuggestionsShown';
export const CHARMS_USAGE_AUTOSELECT_OVERRIDE_MANUAL = 'CharmsUsageAutoSelectOverrideToManual';

export type CharmsUsageSourceComponent =
    | 'QuickCompose'
    | 'CalendarPickerContextMenu'
    | 'ReadingPaneCalendarCharm'
    | 'CalendarItemContextMenuItems'
    | 'CharmPickerAnchorButton';

//--------  Keep in sync with type CharmsUsageSourceComponent -----------------------
export const CHARMS_USAGE_SOURCE_QUICKCOMPOSE = 'QuickCompose';
export const CHARMS_USAGE_SOURCE_CALENDARPICKERCONTEXTMENU = 'CalendarPickerContextMenu';
export const CHARMS_USAGE_SOURCE_READINGPANECALENDARCHARM = 'ReadingPaneCalendarCharm';
export const CHARMS_USAGE_SOURCE_CALENDARITEMCONTEXTMENUITEMS = 'CalendarItemContextMenuItems';
export const CHARMS_USAGE_SOURCE_CHARMPICKERANCHORBUTTON = 'CharmPickerAnchorButton';
//--------------------------------------------------------------------------------------

export default {
    // Data point to log for the Charms scenarios.
    CharmsDatapoint: {
        charmselectiondatapoint: {
            name: 'CharmsDatapoint',
            customData: (
                charmSelectionType: string,
                charmId: number,
                sourceComponent: CharmsUsageSourceComponent
            ): any => {
                return {
                    CharmSelectionType: charmSelectionType,
                    CharmId: charmId,
                    SourceComponent: sourceComponent,
                };
            },
        },

        suggestionsshowndatapoint: {
            name: 'CharmSuggestionsShownDatapoint',
            customData: (charmId: number, keyword: string): any => {
                return {
                    CharmId: charmId,
                    Keyword: keyword,
                };
            },
        },

        charmdefaultsetdatapoint: {
            name: 'CharmDefaultsetDatapoint',
            customData: (charmDefaultSetRequestor: CharmsUsageSourceComponent): any => {
                return {
                    CharmDefaultSetRequestor: charmDefaultSetRequestor,
                };
            },
        },

        autotomanualdatapoint: {
            name: 'CharmsAutoToManualDatapoint',
            customData: (autoSelectCharmId: number, manualOverrideCharmId: number): any => {
                return {
                    AutoSelectCharmId: autoSelectCharmId,
                    ManualOverrideCharmId: manualOverrideCharmId,
                };
            },
        },
    },
};
