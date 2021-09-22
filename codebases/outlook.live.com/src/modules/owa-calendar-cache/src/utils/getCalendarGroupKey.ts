/**
 * Construct the group map key to be a combination of GroupId and userIdentity as the
 * standard groups' GroupIds are same across accounts
 */
export default function getCalendarGroupKey(userIdentity: string, groupId: string): string {
    return `${groupId}_${userIdentity}`;
}
