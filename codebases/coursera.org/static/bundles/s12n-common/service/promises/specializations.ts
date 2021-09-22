import Q from 'q';
import _ from 'underscore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import sparkCoursePricesPromise from 'bundles/payments/promises/sparkCoursePrices';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import specializationPricePromise from 'bundles/payments/promises/specializationPrice';
import specializationsPromiseFactory from 'bundles/s12n-common/service/promises/specializationPromiseFactory';
import memoize from 'js/lib/memoize';

function addPricesFromGringotts(specialization: $TSFixMe) {
  return Q.all([
    specializationPricePromise(specialization.get('id')),
    sparkCoursePricesPromise(specialization.get('courses')),
  ]).spread((specializationPrice, vcPrices) => {
    specialization.set({ price: specializationPrice });

    specialization.get('courses').each((course: $TSFixMe) => {
      const vcPrice = _(vcPrices).findWhere({
        productItemId: course.get('id'),
      });
      course.set('price', vcPrice);
    });

    return specialization;
  });
}

const addPrices = function (specialization: $TSFixMe) {
  return addPricesFromGringotts(specialization);
};

/* eslint-disable import/prefer-default-export */
export const fromId = memoize(function (specializationId: $TSFixMe) {
  return specializationsPromiseFactory(specializationId.toString()).then(addPrices);
});
