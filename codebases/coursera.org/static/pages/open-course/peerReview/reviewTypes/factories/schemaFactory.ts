import { ReviewSchema } from 'bundles/peer/types/Reviews';

import _ from 'underscore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Schema from 'pages/open-course/peerReview/reviewTypes/structured/models/schema';

/**
 * Given data of the form
 * {
 *   typeName: String,
 *   definition: any
 * }
 * constructs and returns the corresponding review schema.
 */
const schemaFactory = function (reviewSchema?: ReviewSchema): Schema {
  const schemaData = reviewSchema || {};

  // @ts-expect-error TSMIGRATION
  return new Schema(_({}).extend(schemaData.definition), { parse: true });
};

export default schemaFactory;
