import { getAnidCookie } from 'owa-mail-ads-shared';
import { getAdTargetingOptOut } from 'owa-topt';
export default async function loadUserChoiceOptOutValue(): Promise<boolean> {
    const userANID = getAnidCookie();
    return getAdTargetingOptOut(userANID);
}
