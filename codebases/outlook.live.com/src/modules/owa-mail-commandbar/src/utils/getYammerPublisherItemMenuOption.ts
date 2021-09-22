import { newYammerPostAction } from '../components/NewMessageButton.locstring.json';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { ControlIcons } from 'owa-control-icons';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';
import loc from 'owa-localize';
import initializeYammerPublisher from 'owa-mail-commands/lib/actions/initializeYammerPublisher';
import onNewYammerPost from 'owa-mail-commands/lib/actions/onNewYammerPost';
import { lazyTryShowYammerPostTeachingMoment } from 'owa-yammer-post';

export function getYammerPublisherItemMenuOption(
    newMessageSplitButtonId: string
): IContextualMenuItem | null {
    if (!isFeatureEnabled('tri-newYammerPostButton')) {
        return null;
    }

    lazyTryShowYammerPostTeachingMoment.importAndExecute(newMessageSplitButtonId);

    // TODO: check if post to yammer from was disabled by tenant admin
    // TODO: check if user has Yammer license
    // TODO: check if user has Yammer presence
    return {
        key: 'yammerPost',
        text: loc(newYammerPostAction),
        iconProps: { iconName: ControlIcons.YammerLogo },
        onClick: onNewYammerPost,
        onMouseOver: initializeYammerPublisher,
    };
}
