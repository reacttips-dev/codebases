import { isEmpty } from 'underscore';
import { useAtlassianAccountOnboardingQuery } from '../AtlassianAccountOnboardingQuery.generated';

export function useAtlassianManagedAccountBanner() {
  const { data } = useAtlassianAccountOnboardingQuery({
    variables: { memberId: 'me' },
  });

  const me = data?.member;
  const ent = me && !isEmpty(me.enterprises) ? me.enterprises[0] : undefined;

  const id = me?.id;
  const aaId = me?.aaId;
  const email = me?.email;
  const name = me?.fullName;
  const orgName = ent?.displayName;

  // Ensure we have all the data necessary to render (none of our fields are null)
  const shouldRender = !!(id && me && name && aaId && email && orgName);

  return {
    me,
    shouldRender,
  };
}
