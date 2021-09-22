import * as trace from 'owa-trace';

export function countTriggers(message: string, triggers: string[]): number {
    return triggers.reduce((numberOfTriggers, trigger) => {
        const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // The regex will match the trigger word if it has a whitespace character
        // in beginning or start of the line and a whitespace character at end
        // or end of line.
        const regexStr = `(^|\\s)${escapedTrigger}(\\s|$)`;
        try {
            // As the trigger words are localized so we escape them in case
            // they contain one of the characters used by RegEx e.g. the
            // strings when running locally using ?gulp
            const triggerRegex = new RegExp(regexStr, 'gi');
            numberOfTriggers += (message.match(triggerRegex) || []).length;
        } catch (error) {
            trace.errorThatWillCauseAlert(
                `[ForgottenAttachments] Error parsing regex when counting trigger words. Regex: ${regexStr}`,
                error
            );
        }

        return numberOfTriggers;
    }, 0);
}
