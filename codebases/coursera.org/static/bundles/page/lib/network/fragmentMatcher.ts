import { NaptimeIntrospectionFragmentMatcher } from './naptimeIntrospectionFragmentMatcher';
import knownTypes from './__generated__/known-types.json';
import contentfulKnownTypes from './__generated__/known-types.contentful.json';

const fragmentMatcherData = {
  __schema: {
    types: [...knownTypes.__schema.types, ...contentfulKnownTypes.__schema.types],
  },
};

const fragmentMatcher = new NaptimeIntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentMatcherData,
});

export default fragmentMatcher;
