import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function shouldNewAdminInstalledAddinsExpActivate(): boolean {
    /* Returns false in case this is a consumer account */
    return !isConsumer();
}
