import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isPrimarySmtp(address: string) {
    return address === getUserConfiguration().SessionSettings.UserEmailAddress;
}
