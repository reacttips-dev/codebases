import loc, { format } from 'owa-localize';
import { accCheckerMenuItemText } from 'owa-locstrings/lib/strings/acccheckermenuitemtext.locstring.json';
import { addToProjectSpace } from 'owa-locstrings/lib/strings/addtoprojectspace.locstring.json';
import { addToBoard } from 'owa-locstrings/lib/strings/addtoboard.locstring.json';
import { archive } from 'owa-locstrings/lib/strings/archive.locstring.json';
import { assignPolicyMenuItemName } from 'owa-locstrings/lib/strings/assignpolicymenuitemname.locstring.json';
import {
    attachTooltip,
    insertTooltip,
} from 'owa-locstrings/lib/strings/attachtooltip.locstring.json';
import { composeProtectButton } from 'owa-locstrings/lib/strings/composeprotectbutton.locstring.json';
import { createRule } from 'owa-locstrings/lib/strings/createrule.locstring.json';
import { deleteItem } from 'owa-locstrings/lib/strings/deleteitem.locstring.json';
import { flag } from 'owa-locstrings/lib/strings/flag.locstring.json';
import { formattingOptionsTooltip } from 'owa-locstrings/lib/strings/formattingoptionstooltip.locstring.json';
import { insertPicturesInlineTooltip } from 'owa-locstrings/lib/strings/insertpicturesinlinetooltip.locstring.json';
import { insertSignature } from 'owa-locstrings/lib/strings/insertsignature.locstring.json';
import { itemHeaderBlock } from 'owa-locstrings/lib/strings/itemheaderblock.locstring.json';
import { itemHeaderFlag } from 'owa-locstrings/lib/strings/itemheaderflag.locstring.json';
import { itemHeaderForward } from 'owa-locstrings/lib/strings/itemheaderforward.locstring.json';
import { itemHeaderLightsOn } from 'owa-locstrings/lib/strings/itemheaderlightson.locstring.json';
import { itemHeaderMarkAsJunk } from 'owa-locstrings/lib/strings/itemheadermarkasjunk.locstring.json';
import { itemHeaderPrint } from 'owa-locstrings/lib/strings/itemheaderprint.locstring.json';
import { itemHeaderReply } from 'owa-locstrings/lib/strings/itemheaderreply.locstring.json';
import { itemHeaderReplyAll } from 'owa-locstrings/lib/strings/itemheaderreplyall.locstring.json';
import { itemHeaderTranslate } from 'owa-locstrings/lib/strings/itemheadertranslate.locstring.json';
import { markAsUnread } from 'owa-locstrings/lib/strings/markasunread.locstring.json';
import { moveToFolder } from 'owa-locstrings/lib/strings/movetofolder.locstring.json';
import { pin } from 'owa-locstrings/lib/strings/pin.locstring.json';
import { popoutsOpenInNewWindow } from 'owa-locstrings/lib/strings/popoutsopeninnewwindow.locstring.json';
import { reportAbuse } from 'owa-locstrings/lib/strings/reportabuse.locstring.json';
import { saveDraft } from 'owa-locstrings/lib/strings/savedraft.locstring.json';
import { sensitivityMenuText } from 'owa-locstrings/lib/strings/sensitivitymenutext.locstring.json';
import { setImportance } from 'owa-locstrings/lib/strings/setimportance.locstring.json';
import { showFrom } from 'owa-locstrings/lib/strings/showfrom.locstring.json';
import { showInImmersiveReader } from 'owa-locstrings/lib/strings/showinimmersivereader.locstring.json';
import { showMessageOptions } from 'owa-locstrings/lib/strings/showmessageoptions.locstring.json';
import { switchToPlainTextMenuItem } from 'owa-locstrings/lib/strings/switchtoplaintextmenuitem.locstring.json';
import type { ComposeActionKey, HoverActionKey, ReadActionKey } from 'owa-outlook-service-options';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    advancedActions,
    customizeActions,
    emojiTooltip,
    itemHeaderLike,
    itemHeaderReplyByMeeting,
    itemHeaderDelete,
    itemHeaderAddToSafeSenders,
    itemHeaderMarkAsPhishing,
    itemHeaderViewMessageSource,
    itemHeaderViewMessageDetails,
    messageSafety,
    none,
    otherAddins,
    otherReplyActions,
    proofingSettings,
    quickUseLabel,
    readUnread,
    replyByImSurfaceActionLabel,
    replyAllByImSurfaceActionLabel,
    setDictationLanguage,
    toggleAmpLabel,
    toggleDarkCompose,
    toggleDictationToolTip,
    viewActions,
    createFluidDocument,
    setReaction,
} from './getDisplayNameFromKey.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';

export const DIVIDER_DISPLAY_NAME = '-';

export function getComposeActionDisplayName(key: ComposeActionKey): string {
    switch (key) {
        case 'AddAttachment':
        case 'AddClassicAttachment':
            return loc(attachTooltip);
        case 'InsertLink':
            return loc(insertTooltip);
        case 'AddInlineImage':
            return loc(insertPicturesInlineTooltip);
        case 'AddEmoji':
            return loc(emojiTooltip);
        case 'QuickUse':
            return loc(quickUseLabel);
        case 'ToggleRibbon':
            return loc(formattingOptionsTooltip);
        case 'SaveDraft':
            return loc(saveDraft);
        case 'InsertSignature':
            return loc(insertSignature);
        case 'ShowFrom':
            return loc(showFrom);
        case 'SetImportance':
            return loc(setImportance);
        case 'ShowMessageOptions':
            return loc(showMessageOptions);
        case 'SwitchBodyType':
            return loc(switchToPlainTextMenuItem);
        case 'SensitivityMenu':
            return loc(sensitivityMenuText);
        case 'ProtectMessage':
            return loc(composeProtectButton);
        case 'AccChecker':
            return loc(accCheckerMenuItemText);
        case 'ToggleDarkCompose':
            return loc(toggleDarkCompose);
        case 'ToggleDictation':
            return loc(toggleDictationToolTip);
        case 'SetDictationLanguage':
            return loc(setDictationLanguage);
        case 'ProofingOptions':
            return loc(proofingSettings);
        case 'FluidHeroButton':
            return loc(createFluidDocument);
        case 'CustomizeActions':
            return loc(customizeActions);
        default:
            return '';
    }
}

export function getReadActionDisplayName(key: ReadActionKey): string {
    switch (key) {
        case 'LikeUnlike':
            return loc(itemHeaderLike);
        case 'SetReaction':
            return loc(setReaction);
        case 'Reply':
            return loc(itemHeaderReply);
        case 'ReplyAll':
            return loc(itemHeaderReplyAll);
        case 'Forward':
            return loc(itemHeaderForward);
        case 'ReplyByMeeting':
            return loc(itemHeaderReplyByMeeting);
        case 'ReportAbuse':
            return loc(reportAbuse);
        case 'Popout':
            return loc(popoutsOpenInNewWindow);
        case 'Delete':
            return loc(itemHeaderDelete);
        case 'MarkReadUnread':
            return loc(markAsUnread);
        case 'FlagUnflag':
            return loc(itemHeaderFlag);
        case 'AssignPolicy':
            return loc(assignPolicyMenuItemName);
        case 'AddToSafeSenders':
            return loc(itemHeaderAddToSafeSenders);
        case 'MarkJunkNotJunk':
            return loc(itemHeaderMarkAsJunk);
        case 'MarkAsPhishing':
            return loc(itemHeaderMarkAsPhishing);
        case 'Block':
            return format(loc(itemHeaderBlock), '');
        case 'CreateRule':
            return loc(createRule);
        case 'Print':
            return loc(itemHeaderPrint);
        case 'Translate':
            return loc(itemHeaderTranslate);
        case 'ShowInImmersiveReader':
            return loc(showInImmersiveReader);
        case 'ViewMessageSource':
            return isConsumer()
                ? loc(itemHeaderViewMessageSource)
                : loc(itemHeaderViewMessageDetails);
        case 'ToggleDarkMode':
            return loc(itemHeaderLightsOn);
        case 'ReplyByIM':
            return loc(replyByImSurfaceActionLabel);
        case 'ReplyAllByIM':
            return loc(replyAllByImSurfaceActionLabel);
        case 'ToggleAmp':
            return loc(toggleAmpLabel);
        case 'AddToBoard':
            return isFeatureEnabled('cal-board-multipleBoards')
                ? loc(addToBoard)
                : loc(addToProjectSpace);
        case 'OtherReplyActions':
            return loc(otherReplyActions);
        case 'MessageSafety':
            return loc(messageSafety);
        case 'View':
            return loc(viewActions);
        case 'CustomizeActions':
            return loc(customizeActions);
        case 'AdvancedActions':
            return loc(advancedActions);
        case 'Addins':
            return loc(otherAddins);
        default:
            return '';
    }
}

export function getHoverActionDisplayName(key: HoverActionKey): string {
    switch (key) {
        case 'None':
            return loc(none);
        case 'Delete':
            return loc(deleteItem);
        case 'Archive':
            return loc(archive);
        case 'PinUnpin':
            return loc(pin);
        case 'ReadUnread':
            return loc(readUnread);
        case 'FlagUnflag':
            return loc(flag);
        case 'Move':
            return loc(moveToFolder);
        default:
            return '';
    }
}
