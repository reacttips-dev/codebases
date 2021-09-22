import getDefaultLogonEmailAddress from './getDefaultLogonEmailAddress';

export default function isDefaultMailbox(userIdentity: string | undefined): boolean {
    return userIdentity == undefined || getDefaultLogonEmailAddress() == userIdentity;
}
