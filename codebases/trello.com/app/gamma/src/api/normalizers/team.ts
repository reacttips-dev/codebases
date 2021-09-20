import { logoDomain } from '@trello/config';
import { OrganizationsResponse } from 'app/gamma/src/types/responses';
import { TeamModel } from 'app/gamma/src/types/models';

import genericNormalizer from './generic';
import { membershipsFromResponse } from './memberships';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeTeam = genericNormalizer<
  OrganizationsResponse,
  TeamModel
>(({ from, has }) => ({
  desc: from('desc'),
  descData: from('descData'),
  displayName: from('displayName'),
  id: from('id'),
  idEnterprise: from('idEnterprise'),
  limits: from('limits'),
  logos: has('logoHash', (logoHash) => {
    return logoHash
      ? ['30', '50', '170'].reduce((logos: { [key: string]: string }, size) => {
          logos[size] = `${logoDomain}/${logoHash}/${size}.png`;

          return logos;
        }, {})
      : null;
  }),
  memberships: membershipsFromResponse,
  name: from('name'),
  prefs: from('prefs'),
  premiumFeatures: from('premiumFeatures'),
  products: from('products'),
  standardVariation: from('standardVariation'),
  teamType: from('teamType'),
  text: from('text'),
  type: from('type'),
  url: from('url'),
  website: from('website'),
}));
