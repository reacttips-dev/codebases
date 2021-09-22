import { getAttachmentTriggerKeywords } from './getAttachmentTriggerKeywords';
import { countTriggers } from './countTriggers';

export function getCountOfAttachmentTriggerKeywords(content: string) {
    const attachmenTriggers = getAttachmentTriggerKeywords();
    return countTriggers(content, attachmenTriggers);
}
