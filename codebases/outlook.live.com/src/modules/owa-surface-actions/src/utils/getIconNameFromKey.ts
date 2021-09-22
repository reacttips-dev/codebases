import { getOwaResourceImageUrl } from 'owa-resource-url';
import { ControlIcons } from 'owa-control-icons';
import { getIsDarkTheme } from 'owa-fabric-theme';
import type { ComposeActionKey, HoverActionKey, ReadActionKey } from 'owa-outlook-service-options';
import { SurfaceActionIcons } from 'owa-surface-action-icons';
import ArrowReplyRegular from 'owa-fluent-icons-svg/lib/icons/ArrowReplyRegular';
import ArrowReplyAllRegular from 'owa-fluent-icons-svg/lib/icons/ArrowReplyAllRegular';
import ArrowForwardRegular from 'owa-fluent-icons-svg/lib/icons/ArrowForwardRegular';
import EmojiRegular from 'owa-fluent-icons-svg/lib/icons/EmojiRegular';
import { isFeatureEnabled } from 'owa-feature-flags';

const ATTACH_SVG = 'attach.svg';
const ATTACHDARK_SVG = 'attachDark.svg';
const INLINEIMAGE_SVG = 'inlineimage.svg';
const INLINEIMAGEDARK_SVG = 'inlineimageDark.svg';
const EMOJI_SVG = 'emoji.svg';
const FLUID_SVG = 'fluid.svg';
const SHOWRIBBON_SVG = 'showribbon.svg';
const SHOWRIBBONDARK_SVG = 'showribbonDark.svg';
const DICTATION_SVG = 'dictate.svg';
const DICTATIONLANGUAGE_SVG = 'dictationLanguage.svg';
const SPELLING_SVG = 'spelling.svg';

export interface SurfaceActionIcon {
    iconName: string;
    fallbackIconName: string;
    isImage: boolean;
}

const useFluentIcons = isFeatureEnabled('mon-densities');

export function getComposeActionIconName(key: ComposeActionKey): SurfaceActionIcon {
    let iconName: string;
    let fallbackIconName: string;
    let isImage = false;

    switch (key) {
        case 'AddAttachment':
            iconName = getSurfaceActionIconUrl(getIsDarkTheme() ? ATTACHDARK_SVG : ATTACH_SVG);
            fallbackIconName = getSurfaceActionIconUrl(ATTACH_SVG);
            isImage = true;
            break;
        case 'AddInlineImage':
            iconName = getSurfaceActionIconUrl(
                getIsDarkTheme() ? INLINEIMAGEDARK_SVG : INLINEIMAGE_SVG
            );
            fallbackIconName = getSurfaceActionIconUrl(INLINEIMAGE_SVG);
            isImage = true;
            break;
        case 'AddEmoji':
            iconName = getSurfaceActionIconUrl(EMOJI_SVG);
            isImage = true;
            break;
        case 'ToggleDarkCompose':
            iconName = ControlIcons.Sunny;
            break;
        case 'FluidHeroButton':
            iconName = getSurfaceActionIconUrl(FLUID_SVG);
            isImage = true;
            break;
        case 'QuickUse':
            iconName = ControlIcons.ClipboardList;
            break;
        case 'ToggleDictation':
            iconName = getSurfaceActionIconUrl(DICTATION_SVG);
            isImage = true;
            break;
        case 'SetDictationLanguage':
            iconName = getSurfaceActionIconUrl(DICTATIONLANGUAGE_SVG);
            isImage = true;
            break;
        case 'ToggleRibbon':
            iconName = getSurfaceActionIconUrl(
                getIsDarkTheme() ? SHOWRIBBONDARK_SVG : SHOWRIBBON_SVG
            );
            fallbackIconName = getSurfaceActionIconUrl(SHOWRIBBON_SVG);
            isImage = true;
            break;
        case 'SensitivityMenu':
            iconName = ControlIcons.MarkAsProtected;
            break;
        case 'ProtectMessage':
            iconName = SurfaceActionIcons.Encryption;
            break;
        case 'SaveDraft':
            iconName = ControlIcons.Save;
            break;
        case 'InsertSignature':
            iconName = SurfaceActionIcons.InsertSignatureLine;
            break;
        case 'ShowFrom':
            iconName = SurfaceActionIcons.ArrangeByFrom;
            break;
        case 'SetImportance':
            iconName = ControlIcons.Important;
            break;
        case 'ShowMessageOptions':
            iconName = ControlIcons.MailOptions;
            break;
        case 'SwitchBodyType':
            iconName = ControlIcons.PlainText;
            break;
        case 'AccChecker':
            iconName = ControlIcons.AccessibiltyChecker;
            break;
        case 'ProofingOptions':
            iconName = getSurfaceActionIconUrl(SPELLING_SVG);
            isImage = true;
            break;
        default:
            iconName = '';
            break;
    }

    return {
        iconName,
        fallbackIconName: fallbackIconName || iconName,
        isImage,
    };
}

export function getReadActionIconName(key: ReadActionKey): SurfaceActionIcon {
    let iconName: string;

    switch (key) {
        case '-':
            iconName = '-';
            break;
        case 'Reply':
            iconName = useFluentIcons ? ArrowReplyRegular : ControlIcons.Reply;
            break;
        case 'ReplyAll':
            iconName = useFluentIcons ? ArrowReplyAllRegular : ControlIcons.ReplyAll;
            break;
        case 'Forward':
            iconName = useFluentIcons ? ArrowForwardRegular : ControlIcons.Forward;
            break;
        case 'ReplyByMeeting':
            iconName = ControlIcons.Calendar;
            break;
        case 'ReportAbuse':
            iconName = ControlIcons.ReportHacked;
            break;
        case 'Delete':
            iconName = ControlIcons.Delete;
            break;
        case 'MarkReadUnread':
            iconName = ControlIcons.Mail;
            break;
        case 'FlagUnflag':
            iconName = ControlIcons.Flag;
            break;
        case 'AssignPolicy':
            iconName = ControlIcons.Assign;
            break;
        case 'AddToSafeSenders':
            iconName = ControlIcons.AddFriend;
            break;
        case 'MarkJunkNotJunk':
            iconName = ControlIcons.MailAlert;
            break;
        case 'MarkAsPhishing':
            iconName = SurfaceActionIcons.Phishing;
            break;
        case 'Block':
            iconName = ControlIcons.BlockContact;
            break;
        case 'CreateRule':
            iconName = SurfaceActionIcons.CreateMailRule;
            break;
        case 'Print':
            iconName = ControlIcons.Print;
            break;
        case 'Translate':
            iconName = ControlIcons.LocaleLanguage;
            break;
        case 'ShowInImmersiveReader':
            iconName = SurfaceActionIcons.ReadOutLoud;
            break;
        case 'ViewMessageSource':
            iconName = ControlIcons.OpenSource;
            break;
        case 'Popout':
            iconName = ControlIcons.OpenInNewWindow;
            break;
        case 'LikeUnlike':
            iconName = ControlIcons.Like;
            break;
        case 'SetReaction':
            iconName = useFluentIcons ? EmojiRegular : ControlIcons.Emoji2;
            break;
        case 'ToggleDarkMode':
            iconName = ControlIcons.Sunny;
            break;
        case 'ReplyByIM':
        case 'ReplyAllByIM':
            iconName = ControlIcons.ChatInviteFriend;
            break;
        case 'ToggleAmp':
            iconName = ControlIcons.LightningBolt;
            break;
        case 'AddToBoard':
            iconName = ControlIcons.NotePinned;
            break;
        default:
            iconName = '';
            break;
    }

    return {
        iconName,
        fallbackIconName: iconName,
        isImage: false,
    };
}

export function getHoverActionIconName(key: HoverActionKey): SurfaceActionIcon {
    let iconName: string;
    switch (key) {
        case '-':
            iconName = '-';
            break;
        case 'Delete':
            iconName = ControlIcons.Delete;
            break;
        case 'Archive':
            iconName = ControlIcons.Archive;
            break;
        case 'PinUnpin':
            iconName = ControlIcons.Pinned;
            break;
        case 'ReadUnread':
            iconName = ControlIcons.Mail;
            break;
        case 'FlagUnflag':
            iconName = ControlIcons.Flag;
            break;
        case 'Move':
            iconName = ControlIcons.FabricFolder;
            break;
        default:
            iconName = '';
            break;
    }
    return {
        iconName,
        fallbackIconName: iconName,
        isImage: false,
    };
}

function getSurfaceActionIconUrl(imageName: string) {
    return getOwaResourceImageUrl('surfaceActions/' + imageName);
}
