import type Message from 'owa-service/lib/contract/Message';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';

export default function isMessageSafe(message: Message): boolean {
    // The message is considered safe when
    // 1) BlockStatus is not defined or is false
    // 2) message.MessageSafety.MessageSafetyLevel is not defined or <= MessageSafetyLevel.Safe
    // For messages from Junk folder, you always get BlockStatus = true,
    // and message.MessageSafety.MessageSafetyLevel = 3 or above
    return (
        message &&
        !message.BlockStatus &&
        (!message.MessageSafety ||
            !message.MessageSafety.MessageSafetyLevel ||
            message.MessageSafety.MessageSafetyLevel <= MessageSafetyLevel.Safe)
    );
}
