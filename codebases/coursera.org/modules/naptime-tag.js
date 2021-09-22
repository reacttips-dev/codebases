// @flow
import type { DocumentNode } from 'graphql';

import gql from 'graphql-tag';
import invariant from 'invariant';
import { translateMutation } from './network/naptimeGraphQLAdapter';

export default function naptimeTag(...args: any): DocumentNode {
  const doc = gql(...args);

  const operations = translateMutation(doc);

  invariant(
    operations.length === 1,
    'We currently only support mutation and only one Naptime action per mutation.'
  );

  // This allows us to move document validation to the template tag
  // and out of the network interface.
  // $FlowFixMe
  Object.assign(doc, {
    fallbackToNaptime: true
  });

  return doc;
}
