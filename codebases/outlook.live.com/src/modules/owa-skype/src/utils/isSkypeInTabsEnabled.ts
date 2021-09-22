import { isFeatureEnabled } from 'owa-feature-flags';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';

export default function isSkypeInTabsEnabled() {
    return isFeatureEnabled('rp-skypeInTabs') && getOwaWorkload() == OwaWorkload.Mail;
}
