import { RibbonId } from './ribbonId';
import GroupStrings from 'owa-locstrings/lib/strings/ribbon_mail_groups.locstring.json';
import PopoutStrings from 'owa-locstrings/lib/strings/popoutsopeninnewwindow.locstring.json';

/**
 * Maps each group to its corresponding string for the corresponding group
 */
export const defaultGroupStringMap = new Map<RibbonId, string>()
    .set(RibbonId.Group_New, GroupStrings.new_GroupButton)
    .set(RibbonId.Group_Delete, GroupStrings.moveAndDelete_GroupButton)
    .set(RibbonId.Group_Respond, GroupStrings.respond_GroupButton)
    .set(RibbonId.Group_Tags, GroupStrings.tags_GroupButton)
    .set(RibbonId.Group_Send, GroupStrings.send_GroupButton)
    .set(RibbonId.Group_Sync, GroupStrings.sync_GroupButton)
    .set(RibbonId.Group_Offline, GroupStrings.offline_GroupButton)
    .set(RibbonId.Group_Download, GroupStrings.download_GroupButton)
    .set(RibbonId.Group_Move, GroupStrings.move_GroupButton)
    .set(RibbonId.Group_QuickSteps, GroupStrings.quickSteps_GroupButton)
    .set(RibbonId.Group_Find, GroupStrings.find_GroupButton)
    .set(RibbonId.Group_Speech, GroupStrings.speech_GroupButton)
    .set(RibbonId.Group_AddIns, GroupStrings.addIns_GroupButton)
    .set(RibbonId.Group_Insights, GroupStrings.insights_GroupButton)
    .set(RibbonId.Group_Protection, GroupStrings.protection_GroupButton)
    .set(RibbonId.Group_ImmersiveReader, GroupStrings.immersiveReader_GroupButton)
    .set(RibbonId.Group_Print, GroupStrings.print_GroupButton)
    .set(RibbonId.Group_Undo, GroupStrings.undo_GroupButton)
    .set(RibbonId.Group_ToggleLeftPane, GroupStrings.toggleLeftPane_Group)
    .set(RibbonId.Group_Clipboard, GroupStrings.clipboard_Group)
    .set(RibbonId.Group_Names, GroupStrings.names_Group)
    .set(RibbonId.Group_Include, GroupStrings.include_Group)
    .set(RibbonId.Group_Voice, GroupStrings.voice_Group)
    .set(RibbonId.Group_Encrypt, GroupStrings.encrypt_Group)
    .set(RibbonId.Group_Save, GroupStrings.save_Group)
    .set(RibbonId.Group_Sensitivity, GroupStrings.sensitivity_Group)
    .set(RibbonId.Group_PopoutDraft, PopoutStrings.popoutsOpenInNewWindow);
