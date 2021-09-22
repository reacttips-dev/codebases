import { RibbonId } from './ribbonId';
import { LabelPreferenceId } from './labelPreferencesIds';
import type { MailRibbonGroup } from '../store/schema/mailRibbonGroup';
import { MailRibbonConfigStore } from '..';

function getRibbonSectionContents(groupId: RibbonId, controlIds: RibbonId[]): MailRibbonGroup {
    return {
        groupId,
        groupName: undefined,
        controlIds,
    };
}

// The default configuration for the SLR buttons
export function getDefaultConfig(): MailRibbonConfigStore {
    return {
        homeTab: {
            layout: [
                getRibbonSectionContents(RibbonId.Group_New, [
                    RibbonId.ToggleLeftPane,
                    RibbonId.NewMessage,
                    RibbonId.DeleteItem,
                    RibbonId.Archive,
                    RibbonId.Sweep,
                    RibbonId.Move,
                    RibbonId.JunkFlyout,
                    RibbonId.IgnoreStopIgnore,
                    RibbonId.Rules,
                ]),
                getRibbonSectionContents(RibbonId.Group_Respond, [
                    RibbonId.RespondReply,
                    RibbonId.RespondReplyAll,
                    RibbonId.RespondForward,
                    RibbonId.ReplyWithMeeting,
                ]),
                getRibbonSectionContents(RibbonId.Group_Tags, [
                    RibbonId.ReadUnread,
                    RibbonId.Categorize,
                    RibbonId.FlagUnflag,
                    RibbonId.PinUnpin,
                    RibbonId.Snooze,
                    RibbonId.AssignPolicy,
                ]),
                getRibbonSectionContents(RibbonId.Group_Find, [
                    RibbonId.AddressBook,
                    RibbonId.BrowseGroups,
                ]),
                getRibbonSectionContents(RibbonId.Group_Undo, [RibbonId.Undo]),
                getRibbonSectionContents(RibbonId.Group_AddIns, [RibbonId.GetAddIns]),
                getRibbonSectionContents(RibbonId.Group_RibbonCustomizer, [
                    RibbonId.RibbonCustomizer,
                ]),
            ],
            controlsInOverflow: [
                RibbonId.BrowseGroups,
                RibbonId.IgnoreStopIgnore,
                RibbonId.JunkFlyout,
                RibbonId.ReplyWithMeeting,
                RibbonId.Rules,
            ],
            staticGroupIdOrdering: [
                RibbonId.Group_New,
                RibbonId.Group_Respond,
                RibbonId.Group_Tags,
                RibbonId.Group_Undo,
                RibbonId.Group_Find,
                RibbonId.Group_AddIns,
            ],
            showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
            removedDefaultGroups: [],
        },
        viewTab: {
            layout: [
                getRibbonSectionContents(RibbonId.Group_ImmersiveReader, [
                    RibbonId.ImmersiveReader,
                ]),
                getRibbonSectionContents(RibbonId.Group_Print, [RibbonId.Print]),
                getRibbonSectionContents(RibbonId.Group_RibbonCustomizer, [
                    RibbonId.RibbonCustomizer,
                ]),
            ],
            controlsInOverflow: [],
            staticGroupIdOrdering: [
                RibbonId.Group_ImmersiveReader,
                RibbonId.Group_Print,
                RibbonId.Group_RibbonCustomizer,
            ],
            showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
            removedDefaultGroups: [],
        },
        messageTab: {
            layout: [
                getRibbonSectionContents(RibbonId.Group_Clipboard, [
                    RibbonId.Paste,
                    RibbonId.FormatPainter,
                ]),
                getRibbonSectionContents(RibbonId.Group_Names, [
                    RibbonId.AddressBook,
                    RibbonId.CheckNames,
                ]),
                getRibbonSectionContents(RibbonId.Group_Include, [
                    RibbonId.AttachFile,
                    RibbonId.AttachSig,
                ]),
                getRibbonSectionContents(RibbonId.Group_Sensitivity, [RibbonId.Sensitivity]),
                getRibbonSectionContents(RibbonId.Group_Tags, [
                    RibbonId.HighImportance,
                    RibbonId.LowImportance,
                    RibbonId.FlagUnflag,
                    RibbonId.AssignPolicy,
                ]),
                getRibbonSectionContents(RibbonId.Group_Voice, [RibbonId.Dictate]),
                getRibbonSectionContents(RibbonId.Group_ImmersiveReader, [
                    RibbonId.ImmersiveReader,
                ]),
                getRibbonSectionContents(RibbonId.Group_Speech, [RibbonId.Group_Speech]),
                getRibbonSectionContents(RibbonId.Group_Encrypt, [RibbonId.Encrypt]),
                getRibbonSectionContents(RibbonId.Group_Save, [RibbonId.Save]),
                getRibbonSectionContents(RibbonId.Group_PopoutDraft, [RibbonId.PopoutDraft]),
                getRibbonSectionContents(RibbonId.Group_RibbonCustomizer, [
                    RibbonId.RibbonCustomizer,
                ]),
            ],
            controlsInOverflow: [RibbonId.Save],
            staticGroupIdOrdering: [
                RibbonId.Group_Clipboard,
                RibbonId.Group_Names,
                RibbonId.Group_Include,
                RibbonId.Group_Sensitivity,
                RibbonId.Group_Tags,
                RibbonId.Group_Voice,
                RibbonId.Group_ImmersiveReader,
                RibbonId.Group_Speech,
                RibbonId.Group_Encrypt,
                RibbonId.Group_Save,
                RibbonId.Group_PopoutDraft,
            ],
            showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
            removedDefaultGroups: [],
        },
        selectedTab: RibbonId.Tab_Home,
    };
}
