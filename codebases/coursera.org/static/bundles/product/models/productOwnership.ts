/* ProductOwnership is a model for responses from productOwnerships API
 * of the product Phoenix service
 *
 * It corresponds to the attributes returned by the API:
 * - owns (boolean)
 * - pendingConfirmation (boolean)
 * - userId (integer)
 * - productId ({id: string})
 * - id (userId + '~' + productId.id)
 * - userSettings ({optedOutOfVerification: boolean})
 */

import Backbone from 'backbone-associations';

const ProductOwnership = Backbone.AssociatedModel.extend({
  parse(data: $TSFixMe) {
    data.userSettings = {
      optedOutOfVerification: data.optedOutOfVerification,
    };
    delete data.optedOutOfVerification;
    return data;
  },
});

export default ProductOwnership;
