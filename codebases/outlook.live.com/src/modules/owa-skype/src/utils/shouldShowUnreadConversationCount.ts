import { SkypeNotificationType, lazyGetUserSkypeOptions } from 'owa-skype-option';

export default function shouldShowUnreadConversationCount(): boolean {
    let skypeOptions = lazyGetUserSkypeOptions.tryImportForRender();

    return skypeOptions && skypeOptions().skypeMessageNotification !== SkypeNotificationType.None;
}
