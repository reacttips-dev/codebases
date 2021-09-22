import type { MemberProfile } from 'bundles/compound-assessments/lib/withTeamActivitySets';

// Sort Team Memebers in a way that the logged in user is always first and then
// rest of the members are sorted based on their userId
const sortMembers = function (members?: Array<MemberProfile> | null, selfUserId?: number): Array<MemberProfile> {
  if (!(members && members.length)) {
    return members || [];
  }

  const sortMemberFn = (a: MemberProfile, b: MemberProfile) => {
    // sort logged in user to head of member icons so always visible
    if (selfUserId) {
      if (a.userId === selfUserId) {
        return -1;
      } else if (b.userId === selfUserId) {
        return 1;
      }
    }

    return a.userId - b.userId;
  };

  return members.sort(sortMemberFn);
};

export default sortMembers;
