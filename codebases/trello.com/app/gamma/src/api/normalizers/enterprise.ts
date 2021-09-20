import { EnterpriseModel } from 'app/gamma/src/types/models';
import { EnterpriseResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeEnterprise = genericNormalizer<
  EnterpriseResponse,
  EnterpriseModel
>(({ from }) => ({
  id: from('id'),
  name: from('name'),
  displayName: from('displayName'),
  logoHash: from('logoHash'),
  logoUrl: from('logoUrl'),
  organizationPrefs: from('organizationPrefs'),
  isAtlassianOrg: from('isAtlassianOrg'),
  atlOrgId: from('atlOrgId'),
}));
