import { format } from 'owa-localize';

const PROFILE_IMAGE_FORMAT_URL: string = '/profile/v1.0/{0}/{1}/image/$value';
/**
 * @param identifier email address or hexConsumerIdForUser
 * @param mailboxType the mailbox type
 */
export default function getImageUrl(identifier: string, mailboxType: string): string {
    const isSmtp = identifier.indexOf('@') > -1;
    const objectType = mailboxType == 'GroupMailbox' ? 'groups' : 'users';

    return format(PROFILE_IMAGE_FORMAT_URL, objectType, isSmtp ? identifier : `cid:${identifier}`);
}
