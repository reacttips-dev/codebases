import { MembershipModel } from 'app/gamma/src/types/models';
import { MembershipResponse } from 'app/gamma/src/types/responses';
import { NormalizationPerAttributeOptions } from './generic';
import { normalizeMembership } from './member';

interface HasMemberships {
  memberships?: MembershipResponse[];
}

interface MembershipResponseById {
  [id: string]: MembershipResponse;
}

export const membershipsFromResponse = <T extends HasMemberships>(
  { memberships }: T,
  existing?: MembershipModel[],
  options?: NormalizationPerAttributeOptions,
): MembershipModel[] | undefined => {
  if (memberships === undefined) {
    // Use the default
    return existing || memberships;
  }
  if (options === 'combine') {
    const existingMemberships = existing || [];
    const updatedById: MembershipResponseById = memberships.reduce(
      (map: MembershipResponseById, model) => {
        map[model.id] = model;

        return map;
      },
      {},
    );
    const added: { [index: string]: boolean } = {};

    return [
      ...existingMemberships.map((membership) => {
        if (updatedById[membership.id]) {
          added[membership.id] = true;

          return normalizeMembership(updatedById[membership.id], membership);
        } else {
          return membership;
        }
      }),
      ...memberships
        .filter((membership) => !added[membership.id])
        .map((membership) => normalizeMembership(membership)),
    ];
  } else {
    return memberships.map((membership) => normalizeMembership(membership));
  }
};
