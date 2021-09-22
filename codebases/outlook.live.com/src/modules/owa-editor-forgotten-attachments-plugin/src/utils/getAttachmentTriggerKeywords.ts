import {
    attachNounsTriggers,
    attachVerbsTriggers,
} from './getAttachmentTriggerKeywords.locstring.json';
import loc from 'owa-localize';

export function getAttachmentTriggerKeywords(): string[] {
    const attachmentTriggers = (loc(attachNounsTriggers) || '')
        .split(',')
        .concat((loc(attachVerbsTriggers) || '').split(','))
        .filter(trigger => trigger !== '');

    return attachmentTriggers;
}
