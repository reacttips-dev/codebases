import { TypePolicies } from '@apollo/client';
import { defaultKeyArgsFunction } from './apolloCache/defaultKeyArgsFunction';
import { addParentConnection } from './apolloCache/addParentConnection';
import { readWithDefault } from './apolloCache/readWithDefault';
import { saveParentId } from './apolloCache/saveParentId';
import {
  boardToCardsRelation,
  listToCardsRelation,
} from './apolloCache/relation';
import { Reference } from '@apollo/client/utilities';
import { queryMap } from './resolvers';
import {
  restResourceFieldPolicies,
  batchRestResourceFieldPolicies,
  readMemberMe,
} from './restResourceResolver/restResourceCacheRedirects';
import { Organization_Limits } from './generated';

// Merging arrays of References with deduplication by __ref
const mergeRefArrays = (...arrs: Reference[][]): Reference[] => {
  return [
    ...arrs
      .flat()
      .filter((item) => item !== undefined)
      .reduce((map: Map<string, Reference>, item: Reference) => {
        const key = item.__ref;
        map.has(key) || map.set(key, item);
        return map;
      }, new Map<string, Reference>())
      .values(),
  ];
};

const fieldPolicies = {
  // eslint-disable-next-line @trello/no-module-logic
  ...restResourceFieldPolicies(queryMap),
  // eslint-disable-next-line @trello/no-module-logic
  ...batchRestResourceFieldPolicies(queryMap),
};

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      ...fieldPolicies,
      member: {
        read: readMemberMe,
      },
    },
  },
  Board: {
    fields: {
      cards: {
        // We have to use it if both read and merge function are defined on the field
        // Otherwise Apollo replaces it with `keyArgs: false`
        // https://github.com/apollographql/apollo-client/blob/2553695750f62657542792e22d0abe9b50a7dab2/src/cache/inmemory/policies.ts#L462
        keyArgs: defaultKeyArgsFunction,
        read: saveParentId,
        // eslint-disable-next-line @trello/no-module-logic
        merge: addParentConnection(boardToCardsRelation),
      },
      prefs: {
        merge: true,
      },
      templateGallery: {
        merge: true,
      },
    },
  },
  List: {
    fields: {
      cards: {
        // We have to use it if both read and merge function are defined on the field
        // Otherwise Apollo replaces it with `keyArgs: false`
        // https://github.com/apollographql/apollo-client/blob/2553695750f62657542792e22d0abe9b50a7dab2/src/cache/inmemory/policies.ts#L462
        keyArgs: defaultKeyArgsFunction,
        read: saveParentId,
        // eslint-disable-next-line @trello/no-module-logic
        merge: addParentConnection(listToCardsRelation),
      },
    },
  },
  Card: {
    fields: {
      checklists: {
        // eslint-disable-next-line @trello/no-module-logic
        read: readWithDefault([]),
      },
      badges: {
        merge: true,
      },
      cover: {
        merge: true,
      },
    },
  },
  Checklist: {
    fields: {
      checkItems: {
        read: readWithDefault([]),
      },
      pos: {
        // -1 means position is unknown. See `calcPos` in app/scripts/lib/util/index.js
        read: readWithDefault(-1),
      },
    },
  },
  Enterprise: {
    fields: {
      paidAccount: {
        merge: true,
      },
      claimableOrganizations: {
        keyArgs: ['name'],
        read(existing, { args }) {
          return existing && existing?.cursor === args?.cursor
            ? undefined
            : existing;
        },
        merge(existing, incoming) {
          return {
            ...incoming,
            organizations: mergeRefArrays(
              existing?.organizations || [],
              incoming.organizations,
            ),
          };
        },
      },
    },
  },
  Organization: {
    fields: {
      paidAccount: {
        merge: true,
      },
      prefs: {
        merge: true,
      },
      /**
       * API for limits will return no count field until the org
       * hits the warnAt threshold, resulting in a cache miss for orgs.
       * Defaulting to null here fixing excessive requests for org
       */
      limits: {
        merge(existing: Organization_Limits, incoming: Organization_Limits) {
          return {
            ...existing,
            ...incoming,
            orgs: {
              ...(existing?.orgs || {}),
              ...(incoming?.orgs || {}),
              freeBoardsPerOrg: {
                ...(existing?.orgs?.freeBoardsPerOrg || {}),
                ...(incoming?.orgs?.freeBoardsPerOrg || {}),
                count:
                  incoming?.orgs?.freeBoardsPerOrg?.count ||
                  existing?.orgs?.freeBoardsPerOrg?.count ||
                  null,
              },
            },
          };
        },
      },
    },
  },
  Member: {
    fields: {
      prefs: {
        merge: true,
      },
      paidAccount: {
        merge: true,
      },
    },
  },
};
