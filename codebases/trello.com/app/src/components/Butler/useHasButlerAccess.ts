import { useMemo } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useHasButlerAccessQuery } from './HasButlerAccessQuery.generated';

/**
 * Checks whether the current user has access to Butler features.
 * At the time of implementation, every Trello user has access to Butler
 * _except_ for non-admin users in enterprises that have explicitly restricted
 * Butler access to admins only. Today, the only enterprise this logic applies
 * to is Bloomberg; for all other users, this will exit fairly early.
 *
 * Functional equivalent of `canShowButlerUI` on the board model; I didn't want
 * to name it `UI` because GraphQL codegen lowercases the I and it looked weird.
 */
export const useHasButlerAccess = (idBoard: string): boolean => {
  const adminOnlyEnterpriseIds = useFeatureFlag<string[]>(
    'workflowers.butler-ent-admin-only-allowlist',
    [],
  );
  const { data } = useHasButlerAccessQuery({ variables: { idBoard } });
  return useMemo(() => {
    if (!data?.board) {
      return false;
    }
    const { idEnterprise } = data.board;
    if (!idEnterprise || !adminOnlyEnterpriseIds.includes(idEnterprise)) {
      return true;
    }
    const idMember = data.member?.id;
    const { organization } = data.board;
    if (!idMember || !organization) {
      return false;
    }
    const { idAdmins } = organization.enterprise ?? {};
    return (
      idAdmins?.includes(idMember) ||
      organization.memberships?.find(
        (membership) => membership.idMember === idMember,
      )?.memberType === 'admin'
    );
  }, [adminOnlyEnterpriseIds, data]);
};
