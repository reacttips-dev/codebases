'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createValidateEmail, getValidateEmail } from 'reference-resolvers/api/EmailValidationAPI';
export var createEmailValidationResolver = function createEmailValidationResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.EMAIL_VALIDATION,
    createFetchByIds: createValidateEmail,
    fetchByIds: getValidateEmail
  }, options));
};
export default createEmailValidationResolver();