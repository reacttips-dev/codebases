import { enrollProduct as enrollProductThroughCourseraPlus } from 'bundles/enroll/lib/courseraPlusEnrollmentsApi';
import { checkSessionsV2Epic } from 'bundles/enroll-course/lib/sessionsV2ExperimentUtils';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import * as apiClient from 'bundles/enroll-course/lib/apiClient';
import createCatalogSubscriptionCart from 'bundles/payments/promises/createCatalogSubscriptionCart';
import createCourseraPlusSubscriptionCart from 'bundles/payments/promises/createCourseraPlusSubscriptionCart';
import createCredentialTrackSubscriptionCart from 'bundles/payments/promises/createCredentialTrackSubscriptionCart';
import createSpecializationCart from 'bundles/payments/promises/createSpecializationCart';
import createPrepaidCart from 'bundles/payments/promises/createPrepaidCart';
import createVCCart from 'bundles/payments/promises/createVCCart';
import createGuidedProjectCart from 'bundles/payments/promises/createGuidedProjectCart';
import AuxiliaryInfo from 'bundles/payments/models/cart/auxiliaryInfo';
import CourseEnrollInfoItem from 'bundles/payments/models/cart/courseEnrollInfoItem';
import S12nEnrollInfoItem from 'bundles/payments/models/cart/s12nEnrollInfoItem';
import { redirectToCheckout } from 'bundles/payments-common/utils/redirectToCheckout';
import { redeemPromotion } from 'bundles/promotions/utils/productDiscountPromoUtils';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { SPECIALIZATION_PREPAID, SPECIALIZATION_SUBSCRIPTION } from 'bundles/payments/common/ProductType';

function getCourseAuxiliaryCartInfo(courseId) {
  const options = {};
  if (courseId) {
    options.auxiliaryCartInfo = new AuxiliaryInfo([
      new CourseEnrollInfoItem({
        definition: { courseId },
      }),
    ]).toJSON();
  }
  return options;
}

function getS12nAuxiliaryCartInfo(s12nId) {
  const options = {};
  if (s12nId) {
    options.auxiliaryCartInfo = new AuxiliaryInfo([
      new S12nEnrollInfoItem({
        definition: { s12nId },
      }),
    ]).toJSON();
  }
  return options;
}

function getCatalogSubscriptionPromise(productSkuId, courseId, data) {
  const options = {};
  const auxiliaryCartInfo = [];

  if (courseId) {
    auxiliaryCartInfo.push(getCourseAuxiliaryCartInfo(courseId).auxiliaryCartInfo[0]);
  }

  if (data && data.s12nId) {
    auxiliaryCartInfo.push(getS12nAuxiliaryCartInfo(data.s12nId).auxiliaryCartInfo[0]);
  }

  options.auxiliaryCartInfo = auxiliaryCartInfo;

  return Promise.resolve()
    .then(() => {
      return createCatalogSubscriptionCart(productSkuId, options);
    })
    .then((cart) => ({ cart }));
}

function getCredentialTrackSubscriptionPromise(credentialTrackProductId, productType, data) {
  const options = {};
  if (data?.couponId) {
    options.couponId = data.couponId;
  }
  options.productType = productType;
  return Promise.resolve()
    .then(() => {
      return createCredentialTrackSubscriptionCart(credentialTrackProductId, options);
    })
    .then((cart) => {
      return { cart };
    });
}

function getSpecializationSubscriptionPromise(productSkuId, courseId, skipWelcomeEmail, data) {
  let options = {};
  if (courseId) {
    options = getCourseAuxiliaryCartInfo(courseId);
  }
  if (data && data.couponId) {
    options.couponId = data.couponId;
  }
  options.productType = SPECIALIZATION_SUBSCRIPTION;

  return Promise.resolve()
    .then(() => {
      return createSpecializationCart(productSkuId, options, skipWelcomeEmail);
    })
    .then((cart) => {
      return { cart };
    });
}

function getSpecializationPrepaidPromise(courseId, data) {
  let options = {};
  const id = data?.paymentPassOption?.productItemId;

  if (courseId) {
    options = getCourseAuxiliaryCartInfo(courseId);
  }
  if (data?.couponId) {
    options.couponId = data.couponId;
  }
  options.productType = SPECIALIZATION_PREPAID;

  return Promise.resolve()
    .then(() => {
      return createPrepaidCart(id, options);
    })
    .then((cart) => {
      return { cart };
    });
}

function getProductIdForCourseraPlus(courseId, s12nId) {
  const { VerifiedCertificate, Specialization } = EnrollmentProductTypes;

  if (s12nId) {
    return tupleToStringKey([Specialization, s12nId]);
  } else if (courseId) {
    return tupleToStringKey([VerifiedCertificate, courseId]);
  } else {
    throw new Error('Cannot create Coursera Plus subscription for unsupported product type');
  }
}

function getCourseIdToGrantMembershipForCourseraPlus(courseId, s12nId) {
  // If enrolling in a s12n, need a specific courseId to also grant membership for
  if (s12nId && courseId) {
    return courseId;
  } else if (courseId) {
    return undefined;
  } else {
    throw new Error('Cannot create Coursera Plus subscription without specific course membership to grant');
  }
}

function getCourseraPlusSubscriptionPromise(productId, courseIdToGrantMembership, productItemId, couponId) {
  return Promise.resolve()
    .then(() => {
      return createCourseraPlusSubscriptionCart(productId, courseIdToGrantMembership, productItemId, couponId);
    })
    .then((cart) => {
      return { cart };
    });
}

/**
 * @type {Object}
 *   <EnrollmentChoiceType>: {Function} that takes in product properties and
 *     returns a promise that handles submit action for the choice type. data is
 *     passed from CourseEnrollModal by parsing data-* field in the top level element
 *     exported by this file.
 */
export const choiceTypeToHandleSubmitPromise = {
  [EnrollmentChoiceTypes.BULKPAY_FULL_SPECIALIZATION]: ({ courseId, data }) => {
    // Explicitly work around create cart promise that has already been done()
    return Promise.resolve()
      .then(() => {
        return checkSessionsV2Epic(courseId).then(() => {
          return createSpecializationCart(data.s12nId, getCourseAuxiliaryCartInfo(courseId));
        });
      })
      .then((cart) => {
        return { cart };
      });
  },
  [EnrollmentChoiceTypes.BULKPAY_REMAINING_SPECIALIZATION_COURSES]: ({ courseId, data }) => {
    // Explicitly work around create cart promise that has already been done()
    return Promise.resolve()
      .then(() => {
        return checkSessionsV2Epic(courseId).then(() => {
          return createSpecializationCart(data.s12nId, getCourseAuxiliaryCartInfo(courseId));
        });
      })
      .then((cart) => {
        return { cart };
      });
  },
  [EnrollmentChoiceTypes.PURCHASE_SINGLE_COURSE]: ({ courseId, data }) => {
    // Explicitly work around create cart promise that has already been done()
    return Promise.resolve()
      .then(() => {
        return checkSessionsV2Epic(courseId).then(() => {
          return createVCCart(courseId, data);
        });
      })
      .then((cart) => {
        return { cart };
      });
  },
  [EnrollmentChoiceTypes.ENROLL_COURSE]: ({ courseId }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return apiClient.enrollInCourseForFreePromise(courseId);
    });
  },
  [EnrollmentChoiceTypes.AUDIT_COURSE]: ({ courseId }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return apiClient.enrollInCourseForFreePromise(courseId);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_PROGRAM]: ({ courseId, data }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return apiClient.enrollInCourseWithProgram(courseId, data.programid);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_GROUP]: ({ courseId, data }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return apiClient.enrollInCourseWithGroup(courseId, data.groupid);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_PREPAID]: ({ courseId, data }) => {
    const checkSessionsIfCourse = courseId ? checkSessionsV2Epic(courseId) : Promise.resolve();

    return checkSessionsIfCourse.then(() => {
      return getSpecializationPrepaidPromise(courseId, data);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION]: ({ productSkuId, courseId, skipWelcomeEmail, data }) => {
    const checkSessionsIfCourse = courseId ? checkSessionsV2Epic(courseId) : Promise.resolve();

    return checkSessionsIfCourse.then(() => {
      return getSpecializationSubscriptionPromise(productSkuId, courseId, skipWelcomeEmail, data);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL]: ({
    productSkuId,
    courseId,
    skipWelcomeEmail,
    data,
  }) => {
    const checkSessionsIfCourse = courseId ? checkSessionsV2Epic(courseId) : Promise.resolve();

    return checkSessionsIfCourse.then(() => {
      return getSpecializationSubscriptionPromise(productSkuId, courseId, skipWelcomeEmail, data);
    });
  },
  [EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG]: ({ productSkuId, courseId, data }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return getCatalogSubscriptionPromise(productSkuId, courseId, data);
    });
  },
  [EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG_TRIAL]: ({ productSkuId, courseId, data }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return getCatalogSubscriptionPromise(productSkuId, courseId, data);
    });
  },
  [EnrollmentChoiceTypes.UPGRADE_TO_CATALOG_SUBSCRIPTION]: ({ productSkuId, courseId, data }) => {
    return checkSessionsV2Epic(courseId).then(() => {
      return getCatalogSubscriptionPromise(productSkuId, courseId, data);
    });
  },
  [EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS]: ({
    courseId,
    s12nId,
    isSubscriptionOnly,
    productItemId,
    data,
  }) => {
    const checkSessionsIfCourse = courseId ? checkSessionsV2Epic(courseId) : Promise.resolve();

    return checkSessionsIfCourse.then(() => {
      let productId;
      let courseIdToGrantMembership;

      // `isSubscriptionOnly` specifically indicates user is subscribing to Coursera Plus without enrollment
      if (!isSubscriptionOnly) {
        productId = getProductIdForCourseraPlus(courseId, s12nId);
        courseIdToGrantMembership = getCourseIdToGrantMembershipForCourseraPlus(courseId, s12nId);
      }
      return getCourseraPlusSubscriptionPromise(productId, courseIdToGrantMembership, productItemId, data?.couponId);
    });
  },
  [EnrollmentChoiceTypes.ENROLL_THROUGH_COURSERA_PLUS]: ({ courseId, s12nId }) => {
    const checkSessionsIfCourse = courseId ? checkSessionsV2Epic(courseId) : Promise.resolve();

    return checkSessionsIfCourse.then(() => {
      const productId = getProductIdForCourseraPlus(courseId, s12nId);
      const courseIdToGrantMembership = getCourseIdToGrantMembershipForCourseraPlus(courseId, s12nId);
      return enrollProductThroughCourseraPlus(productId, courseIdToGrantMembership);
    });
  },
  // Rename to ENROLL_THROUGH_CREDENTIALTRACK_SUBSCRIPTION_V2 after cleaning up V1 code
  [EnrollmentChoiceTypes.ENROLL_THROUGH_CREDENTIALTRACK_SUBSCRIPTION]: ({
    credentialTrackProductId,
    productType,
    data,
  }) => {
    return getCredentialTrackSubscriptionPromise(credentialTrackProductId, productType, data);
  },
};

export const guidedProjectSubmitPromise = ({ courseId, data }) => {
  return checkSessionsV2Epic(courseId)
    .then(() => {
      return createGuidedProjectCart(courseId, data);
    })
    .then((cart) => {
      return { cart };
    });
};

export const doesChoiceTypeHaveSubmitHandler = (choiceType) => {
  return (
    !!choiceTypeToHandleSubmitPromise[choiceType] ||
    choiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_PROGRAM_INVITATION
  );
};

export const submitEnrollmentPromise = ({ handleSubmitPromise, options, promoCode, additionalParams, isFinaid }) => {
  const queryParams = { ...additionalParams };
  const promiseOptions = { ...options };

  // redeemPromotion passes through if no promoCode
  return redeemPromotion(promoCode)
    .then((promoData) => {
      if (promoData?.couponId) {
        promiseOptions.data = { ...options.data, couponId: promoData.couponId };
      } else if (promoData?.promoErrorCode) {
        queryParams.promoErrorCode = promoData.promoErrorCode;
      }

      return handleSubmitPromise(promiseOptions);
    })
    .then((data) => {
      // Not all enrollment submission promises will result in a cart
      // If a cart was not created, enrollment already occurred
      if (data && data.cart) {
        redirectToCheckout(data.cart, queryParams, isFinaid);
        return data;
      } else {
        return { didEnroll: true };
      }
    });
};
