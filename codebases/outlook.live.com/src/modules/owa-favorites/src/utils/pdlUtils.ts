import type { PrivateDistributionListMember } from 'owa-persona-models';

export function haveSameMembers(
    members1: PrivateDistributionListMember[],
    members2: PrivateDistributionListMember[]
): boolean {
    if (members1.length !== members2.length) {
        return false;
    }

    const mails1 = members1.map(member => member.emailAddress.toLocaleLowerCase());
    const mails2 = members2.map(member => member.emailAddress.toLocaleLowerCase());
    const common = mails1.filter(mail => mails2.includes(mail));

    return common.length === mails1.length;
}
