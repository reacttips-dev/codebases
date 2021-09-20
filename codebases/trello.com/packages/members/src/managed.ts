import { EnterpriseLicenseType } from '@trello/enterprise';

interface IsPaidManagedEnterpriseMemberArgs {
  confirmed?: boolean;
  idEnterprise?: string | null;
  enterpriseLicenses?:
    | {
        idEnterprise?: string;
        type?: EnterpriseLicenseType;
      }[]
    | null;
}

/**
 * A user is considered a Paid Managed Enterprise Member if all of the
 * following are true:
 *
 * - The user has a confirmed email
 * - The user has an `idEnterprise` (this designates them as managed)
 * - The user has a license for that enterprise
 */
export const isPaidManagedEnterpriseMember = ({
  confirmed = false,
  idEnterprise = null,
  enterpriseLicenses,
}: IsPaidManagedEnterpriseMemberArgs): boolean => {
  if (!confirmed || !idEnterprise || !enterpriseLicenses) {
    return false;
  }
  return Boolean(
    enterpriseLicenses.filter((license) => {
      return license.type === 'team' && license.idEnterprise === idEnterprise;
    }).length > 0,
  );
};
