import { useIsEnterpriseOwnedMemberQuery } from './IsEnterpriseOwnedMemberQuery.generated';
import { memberId } from '@trello/session-cookie';

export const useIsEnterpriseOwnedMember = () => {
  const { data } = useIsEnterpriseOwnedMemberQuery({
    skip: !memberId,
  });

  return !!data?.member?.enterprises?.find(
    (ent) => ent.id === data?.member?.idEnterprise,
  )?.isRealEnterprise;
};
