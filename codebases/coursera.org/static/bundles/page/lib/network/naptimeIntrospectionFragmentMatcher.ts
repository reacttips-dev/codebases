// This matcher is a hybrid heuristic & introspection fragment matcher.
// As we move to Apollo V3 (TODO) and / or move away from naptime-link
// This approach has to be revised.

import { isTest } from 'apollo-utilities';
import type { IdValue } from 'apollo-utilities';
import type {
  FragmentMatcherInterface,
  IntrospectionResultData,
  PossibleTypesMap,
  ReadStoreContext,
} from 'apollo-cache-inmemory';
import { invariant } from 'ts-invariant';

let haveWarned = false;

function shouldWarn() {
  const answer = !haveWarned;
  /* istanbul ignore if */
  if (!isTest()) {
    haveWarned = true;
  }
  return answer;
}
export class NaptimeIntrospectionFragmentMatcher implements FragmentMatcherInterface {
  private isReady: boolean;

  private possibleTypesMap!: PossibleTypesMap;

  constructor(options?: { introspectionQueryResultData?: IntrospectionResultData }) {
    if (options && options.introspectionQueryResultData) {
      this.possibleTypesMap = this.parseIntrospectionResult(options.introspectionQueryResultData);
      this.isReady = true;
    } else {
      this.isReady = false;
    }

    this.match = this.match.bind(this);
  }

  public match(idValue: IdValue, typeCondition: string, context: ReadStoreContext) {
    invariant(this.isReady, 'FragmentMatcher.match() was called before FragmentMatcher.init()');

    const obj = context.store.get(idValue.id);

    if (!obj && idValue.id === 'ROOT_QUERY') {
      return true;
    }

    if (!obj) {
      return false;
    }

    // Naptime fragments are not true fragments and as such do not provide a typename of either kind
    // As such we revert to heuristic matcher behaviour, but do not throw a runtime error.
    // invariant(typename, `Cannot match fragment because __typename property is missing: ${JSON.stringify(obj)}`);
    if (!obj.__typename) {
      if (shouldWarn()) {
        invariant.warn(`You're using fragments in your queries, but either don't have the addTypename:
  true option set in Apollo Client, or you are trying to write a fragment to the store without the __typename.
   Please turn on the addTypename option and include __typename when writing fragments so that Apollo Client
   can accurately match fragments.`);
        invariant.warn('Could not find __typename on Fragment ', typeCondition, obj);
        invariant.warn(
          `DEPRECATION WARNING: using fragments without __typename is unsupported behavior ` +
            `and will be removed in future versions of Apollo client. You should fix this and set addTypename to true now.`
        );
      }

      return 'heuristic';
    }

    if (obj.__typename === typeCondition) {
      return true;
    }

    const implementingTypes = this.possibleTypesMap[typeCondition];

    if (implementingTypes && implementingTypes.indexOf(obj.__typename) > -1) {
      return true;
    }

    // Note: Here to avoid data not being written to store,
    // When some of the mistyped Naptime fragments get through.
    // Seen exhibited particularly in `degree-home` with `NaptimeDegreeLearnerCourseStatesV1`
    // instead of `DegreeLearnerCourseStatesV1` union members.
    if (obj.__typename.indexOf('Naptime') === 0) {
      return 'heuristic';
    }

    return false;
  }

  private parseIntrospectionResult(introspectionResultData: IntrospectionResultData): PossibleTypesMap {
    const typeMap: PossibleTypesMap = {};
    introspectionResultData.__schema.types.forEach((type) => {
      if (type.kind === 'UNION' || type.kind === 'INTERFACE') {
        typeMap[type.name] = type.possibleTypes.map((implementingType) => implementingType.name);
      }
    });
    return typeMap;
  }
}

export default NaptimeIntrospectionFragmentMatcher;
