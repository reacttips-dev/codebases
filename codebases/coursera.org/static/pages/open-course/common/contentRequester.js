/**
 * Deprecated in favor of ./naptimeItemClient.
 */

import Q from 'q';

import user from 'js/lib/user';
import path from 'js/lib/path';
import URI from 'jsuri';
import api from 'pages/open-course/common/api';
import { memoizedCourseGradePromise } from 'pages/open-course/common/promises/courseGrade';
import { memoizedCourseProgressPromise } from 'pages/open-course/common/promises/courseProgress';

const apiUrl = function (typeName) {
  const apiUrls = {
    closedPeer: 'peer',
    gradedPeer: 'peer',
    phasedPeer: 'peer',
    splitPeerReviewItem: 'peer',
  };
  return apiUrls[typeName] || typeName;
};

const buildBaseUrl = function () {
  return path.join(
    'user',
    user.get().id,
    'course',
    this.itemMetadata.get('course').get('slug'),
    'item',
    this.itemMetadata.getId(),
    apiUrl(this.itemMetadata.getTypeName())
  );
};

const ContentRequester = function (itemMetadata) {
  this.itemMetadata = itemMetadata;
};

ContentRequester.prototype.request = function (requestUrl, requestBody) {
  const itemMetadata = this.itemMetadata;

  const baseUrl = buildBaseUrl.call(this);
  const uri = new URI(path.join(baseUrl, requestUrl));
  if (/action/.test(requestUrl)) {
    // Per FLEX-1952, we must add this to make sure learners don't accidentally get auto-enrolled.
    uri.addQueryParam('autoEnroll', 'false');
  }
  const options = {
    data: {
      contentRequestBody: requestBody,
    },
  };

  return Q.allSettled([
    memoizedCourseGradePromise(itemMetadata.get('course').get('id')),
    memoizedCourseProgressPromise(itemMetadata.get('course').get('slug')),
    api.post(uri.toString(), options),
  ]).spread(function (courseGradeResult, courseProgressResult, apiResponseResult) {
    if (apiResponseResult.state === 'rejected') {
      throw apiResponseResult.reason;
    }

    const courseProgress = courseProgressResult.value;
    const courseGrade = courseGradeResult.value;
    const apiResponse = apiResponseResult.value;

    const itemId = itemMetadata.getId();
    const itemProgress = courseProgress.getItemProgress(itemId);
    if (itemProgress && apiResponse && apiResponse.itemProgress) {
      itemProgress.set(apiResponse.itemProgress, {
        refreshCourseProgress: true,
      });
    }

    const itemGrade = courseGrade.getItemGrade(itemId);
    if (itemGrade && apiResponse && apiResponse.itemGradeRecord) {
      // Immediately update the item grade so that anyone using it gets to see the updated information as soon
      // as possible.
      itemGrade.set(apiResponse.itemGradeRecord);

      // Asynchronously request the whole course grade object so that we see any updated computed fields that have
      // been affected by the changed item grade.
      courseGrade.refresh();
    }

    return apiResponse && apiResponse.contentResponseBody;
  });
};

export default ContentRequester;
