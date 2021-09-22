import _t from 'i18n!nls/discussions';
import React from 'react';
import { questions } from 'bundles/discussions/constants';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import CMLParser from 'bundles/cml/models/CMLParser';

const MAX_CONTENT_LEN = questions.details.maxChars;
const CONTENT_WARN_LEN = questions.details.warnChars;
const MIN_CML_LEN = CMLParser.EMPTY_CML.length + '<text></text>'.length;

const getApproachingLimitString = () => _t('You are approaching the character limit |\u00a0');
const getExceededLimitString = () => _t('You have exceeded the character limit |\u00a0');

const DiscourseCMLUtils = {
  generateContentLengthWarning(cml) {
    const contentLength = CMLUtils.getValue(cml).length;
    let contentLengthWarning;
    // This is not the most accurate way to calculate length,
    // but the length is so long that we don't really care.
    if (contentLength > CONTENT_WARN_LEN + MIN_CML_LEN && contentLength <= MAX_CONTENT_LEN + MIN_CML_LEN) {
      contentLengthWarning = (
        <div className="c-form-error-message">
          {getApproachingLimitString() + contentLength + '/' + MAX_CONTENT_LEN}
        </div>
      );
    } else if (contentLength > MAX_CONTENT_LEN + MIN_CML_LEN) {
      contentLengthWarning = (
        <div className="c-error-text c-form-error-message">
          {getExceededLimitString() + contentLength + '/' + MAX_CONTENT_LEN}
        </div>
      );
    }
    return contentLengthWarning;
  },

  /*
    Validate CML and return error code to distinguish between different errors
  */
  checkForErrors: (cml) => {
    if (CMLUtils.isEmpty(cml)) {
      return 'TOO_SHORT';
      // This is not the most accurate way to calculate length,
      // but the length is so long that we don't really care.
    } else if (CMLUtils.getValue(cml).length > MAX_CONTENT_LEN + MIN_CML_LEN) {
      return 'TOO_LONG';
    } else {
      return null;
    }
  },

  validateLength(cml) {
    if (CMLUtils.isEmpty(cml)) {
      return false;
      // This is not the most accurate way to calculate length,
      // but the length is so long that we don't really care.
    } else if (CMLUtils.getValue(cml).length > MAX_CONTENT_LEN + MIN_CML_LEN) {
      return false;
    } else {
      return true;
    }
  },

  getImageUploadOptions(courseId, questionId) {
    return {
      context: {
        courseId,
        questionId,
      },
      pendingAssetCreation: {
        assetType: 'image',
        typeName: 'pending',
        tags: [],
      },
      assetCreationUrl: '/api/onDemandDiscussionsAssetCreationAttempts.v1',
    };
  },
};

export default DiscourseCMLUtils;

export const {
  generateContentLengthWarning,
  checkForErrors,
  validateLength,
  getImageUploadOptions,
} = DiscourseCMLUtils;
