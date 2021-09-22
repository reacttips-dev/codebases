import type StaticAction from '../store/schema/StaticAction';
import { isProofingSupported } from 'owa-editor-proofing-common';
import type ReadStaticAction from '../store/schema/ReadStaticAction';
import isMessageOptionsEnabled from './isMessageOptionsEnabled';
import { isEncryptionEnabled } from 'owa-encryption-common';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isFluidEnabledForSource, FluidOwaSource } from 'owa-fluid-validations';
import { isOutlookSpacesEnabled } from 'owa-timestream-enabled';
import {
    ActionKey,
    getOptionsForFeature,
    OwsOptionsFeatureType,
    ReadActionKey,
    SurfaceActionsOptions,
} from 'owa-outlook-service-options';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getIsDarkTheme } from 'owa-fabric-theme';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type Message from 'owa-service/lib/contract/Message';
import { isBrowserChrome, isBrowserFirefox, isBrowserEdge } from 'owa-user-agent/lib/userAgent';

/**
 * Return all the actions that should be shown on an item in Reading Pane
 *
 * IMPORTANT: When adding or removing an action ensure that a corresponding lines are added/removed in the following files:
 * getIconNameFromKey.ts
 * getDisplayNameFromKey.ts
 */
export function getReadStaticActions(): ReadStaticAction[] {
    let actions: ReadStaticAction[] = [
        { key: 'Reply', hideInGroup: true, hideInSxS: true },
        { key: 'ReplyAll', hideInGroup: false, hideInSxS: true },
        { key: 'Forward', hideInGroup: false, hideInSxS: true },
    ];

    actions.push(
        { key: '-', hideInGroup: false, hideInSxS: false },
        { key: 'ReplyByMeeting', hideInGroup: true, hideInSxS: true },
        { key: '-', hideInGroup: false, hideInSxS: false },
        { key: 'Delete', hideInGroup: false, hideInSxS: true },
        { key: '-', hideInGroup: false, hideInSxS: false },
        { key: 'MarkReadUnread', hideInGroup: false, hideInSxS: true },
        { key: 'FlagUnflag', hideInGroup: true, hideInSxS: true },
        { key: '-', hideInGroup: false, hideInSxS: false }
    );

    if (isFeatureEnabled('fwk-skypeBusinessV2')) {
        actions.push(
            { key: 'ReplyByIM', hideInGroup: true, hideInSxS: false },
            { key: 'ReplyAllByIM', hideInGroup: true, hideInSxS: false },
            { key: '-', hideInGroup: true, hideInSxS: false }
        );
    }

    if (isOutlookSpacesEnabled() || isFeatureEnabled('cal-sublimity')) {
        actions.push(
            { key: 'AddToBoard', hideInGroup: false, hideInSxS: false },
            { key: '-', hideInGroup: false, hideInSxS: false }
        );
    }

    if (!getUserConfiguration().SessionSettings.IsShadowMailbox) {
        actions.push(
            { key: 'AddToSafeSenders', hideInGroup: true, hideInSxS: true },
            { key: 'MarkJunkNotJunk', hideInGroup: true, hideInSxS: true },
            { key: 'MarkAsPhishing', hideInGroup: true, hideInSxS: true },
            { key: 'Block', hideInGroup: true, hideInSxS: true }
        );

        if (isFeatureEnabled('tri-reportAbuse')) {
            actions.push({ key: 'ReportAbuse', hideInGroup: !isConsumer(), hideInSxS: true });
        }
        actions.push({ key: '-', hideInGroup: false, hideInSxS: false });
    }

    if (!isConsumer()) {
        actions.push(
            { key: 'AssignPolicy', hideInGroup: false, hideInSxS: true },
            { key: '-', hideInGroup: false, hideInSxS: false }
        );
    }

    if (!getUserConfiguration().SessionSettings.IsShadowMailbox) {
        actions.push({ key: 'CreateRule', hideInGroup: true, hideInSxS: true });
    }

    actions.push({ key: 'Print', hideInGroup: false, hideInSxS: false });

    if (
        isFeatureEnabled('rp-inlineTranslation') &&
        isFeatureEnabled('rp-inlineTranslationManual')
    ) {
        actions.push({ key: 'Translate', hideInGroup: true, hideInSxS: true });
    }

    if (getIsDarkTheme()) {
        actions.push({ key: 'ToggleDarkMode', hideInGroup: false, hideInSxS: false });
    }

    if (isFeatureEnabled('rp-immersiveReader')) {
        actions.push({ key: 'ShowInImmersiveReader', hideInGroup: false, hideInSxS: true });
    }

    actions.push({ key: 'ViewMessageSource', hideInGroup: false, hideInSxS: true });
    actions.push({ key: 'Popout', hideInGroup: false, hideInSxS: true });

    // Likes should not be shown when Reactions are enabled.
    if (!isFeatureEnabled('rp-reactions') && !isConsumer()) {
        actions.push({ key: 'LikeUnlike', hideInGroup: false, hideInSxS: true });
    }

    // SetReaction.
    if (isFeatureEnabled('rp-reactions')) {
        actions.push({
            key: 'SetReaction',
            hideInGroup: false,
            hideInSxS: true,
            hideInMailSurfaceSettings: true,
        });
    }

    if (isFeatureEnabled('rp-amp') && isConsumer()) {
        actions.push({ key: 'ToggleAmp', hideInGroup: false, hideInSxS: true });
    }

    actions.push(
        { key: 'OtherReplyActions', hideInMailSurfaceSettings: true },
        { key: 'MessageSafety', hideInMailSurfaceSettings: true },
        { key: 'View', hideInMailSurfaceSettings: true },
        { key: 'CustomizeActions', hideInMailSurfaceSettings: true },
        { key: 'AdvancedActions', hideInMailSurfaceSettings: true },
        { key: 'Addins', hideInMailSurfaceSettings: true }
    );

    return actions;
}

/**
 * IMPORTANT: When adding or removing an action ensure that a corresponding lines are added/removed in the following files:
 * getIconNameFromKey.ts
 * getDisplayNameFromKey.ts
 */
export function getComposeStaticActions(): StaticAction[] {
    let actions: StaticAction[] = [];
    actions.push({ key: 'AddAttachment', hideInGroup: false });

    actions.push({ key: 'AddInlineImage', hideInGroup: false });

    if (isFluidEnabledForSource(FluidOwaSource.MailCompose)) {
        actions.push({ key: 'FluidHeroButton', hideInGroup: false });
    }

    // If adding the expression picker button, it must be placed after
    // button to add inline image.
    actions.push({ key: 'AddEmoji', hideInGroup: false });

    if (isProofingSupported()) {
        actions.push({ key: 'ProofingOptions', hideInGroup: false });
    }

    // Dictation
    if (
        (isBrowserEdge() || isBrowserFirefox() || isBrowserChrome()) &&
        isFeatureEnabled('cmp-dictation')
    ) {
        actions.push({ key: 'ToggleDictation', hideInGroup: false });
    }

    // Add the rest of the always-provided actions.
    actions = actions.concat([
        { key: 'ToggleRibbon', hideInGroup: false },
        { key: 'SaveDraft', hideInGroup: false },
        { key: 'InsertSignature', hideInGroup: false },
        { key: 'ShowFrom', hideInGroup: false },
        { key: 'SetImportance', hideInGroup: false },
        { key: 'SwitchBodyType', hideInGroup: false },
        { key: 'AccChecker', hideInGroup: false },
    ]);

    if (isFeatureEnabled('cmp-clp') && !isConsumer()) {
        actions.push({ key: 'SensitivityMenu', hideInGroup: false });
    }

    if (isEncryptionEnabled()) {
        actions.push({ key: 'ProtectMessage', hideInGroup: false });
    }

    // TODO #33638 Move ShowMessageOptions to owa-mail.
    if (isMessageOptionsEnabled()) {
        actions.push({ key: 'ShowMessageOptions', hideInGroup: false });
    }

    actions.push({ key: 'CustomizeActions', hideInGroup: false, hideInMailSurfaceSettings: true });

    return actions;
}

export function shouldAddActionToEnd(action: ActionKey): boolean {
    // Reply, ReplyAll, and Forward are the first 3 actions in the set of static actions in the reading pane.
    // While all other actions should render from right to left based on their order in the settings,
    // the desire is for these three to render left to right, so they should be inserted at the end of the collection.
    return action == 'Reply' || action == 'ReplyAll' || action == 'Forward';
}

export function isReadingPaneSurfaceActionPinnedByUser(actionKey: ReadActionKey) {
    const surfaceActionsOptions = getOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );

    return surfaceActionsOptions.readSurfaceActions.indexOf(actionKey) !== -1;
}

export function shouldActionBeOnReadingPaneSurface(
    actionKey: ReadActionKey,
    message: Message
): boolean {
    return (
        isReadingPaneSurfaceActionPinnedByUser(actionKey) ||
        // if there are likes & likers on a message, pin it
        // even if the CSA has not been set by the user
        // Likes should not be seeing when Reactions are enabled.
        !!(
            isFeatureEnabled('rp-csaPinnedLikes') &&
            !isFeatureEnabled('rp-reactions') &&
            actionKey === 'LikeUnlike' &&
            message.LikeCount
        ) ||
        // pin toggle dark mode on surface if it is dark theme
        !!(actionKey === 'ToggleDarkMode' && getIsDarkTheme()) ||
        // pin toggle amp on surface if consumer account and
        // features rp-amp is enabled
        !!(actionKey === 'ToggleAmp' && isFeatureEnabled('rp-amp') && isConsumer()) ||
        !!(actionKey === 'SetReaction' && isFeatureEnabled('rp-reactions'))
    );
}
