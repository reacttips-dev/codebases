import Q from 'q';
import _ from 'underscore';
import path from 'js/lib/path';
import stringKeyTuple from 'js/lib/stringKeyTuple';
import URI from 'jsuri';
import user from 'js/lib/user';
import api from 'pages/open-course/common/naptimeApi';
import { memoizedCourseGradePromise } from 'pages/open-course/common/promises/courseGrade';
import { memoizedCourseViewGradePromise } from 'pages/open-course/common/promises/courseViewGrade';
import { memoizedCourseProgressPromise } from 'pages/open-course/common/promises/courseProgress';

/**
 * Converts a jqXHR to a promise that contains a {body: object, createdId: string}
 * object that contains the response body and the value of the X-Coursera-Id header.
 */
function jqXHRToPromiseWithId(jqXHR) {
  return Q(jqXHR).then(function(body) {
    return {
      body,
      createdId: jqXHR.getResponseHeader('X-Coursera-Id'),
    };
  });
}

function makeUri(resource, args) {
  const uri = new URI(resource);

  if (args) {
    _(args).each(function(value, key) {
      uri.addQueryParam(key, value);
    });
  }

  return uri;
}

const NaptimeItemClient = function({ itemId, courseId, courseSlug }) {
  this.itemId = itemId;
  this.courseId = courseId;
  this.courseSlug = courseSlug;
};

/**
 * Call a naptime create(). Automatically refreshes any course progress affected by the create().
 *
 * @param {string} resource The name of the naptime resource.
 * @param {object} body The body of the create request.
 * @param {object} args The URI arguments.
 * @param {boolean} mightUpdateProgress whether calling this might update any course progress. Defaults to true.
 * @returns Promise for a {body: object, createdId: string}.
 */
NaptimeItemClient.prototype.create = function(resource, body, args, mightUpdateProgress) {
  const uri = makeUri(resource, args);

  if (mightUpdateProgress === undefined) {
    mightUpdateProgress = true;
  }

  const requestOptions = {
    data: body,
  };

  return Q.all([
    memoizedCourseGradePromise(this.courseId),
    memoizedCourseViewGradePromise(user.get().id + '~' + this.courseId),
    memoizedCourseProgressPromise(this.courseSlug),
    jqXHRToPromiseWithId(api.post(uri.toString(), requestOptions)),
  ]).spread(function(courseGrade, courseViewGrade, courseProgress, apiResponse) {
    if (mightUpdateProgress) {
      courseGrade.refresh();
      courseViewGrade.refresh();
      courseProgress.trigger('refresh');
    }
    return apiResponse;
  });
};

/**
 * Call a naptime get().
 *
 * @param {string} resource The name of the naptime resource.
 * @param {string} id The id of the requested object.
 * @param {object} args The URI arguments.
 * @param {boolean} mightRevealChangedProgress Whether calling this might have an affect on course progress.
 * @returns Promise for the request.
 */
NaptimeItemClient.prototype.get = function(resource, id, args, mightRevealChangedProgress) {
  const uri = makeUri(path.join(resource, id), args);

  return Q.all([api.get(uri.toString()), memoizedCourseProgressPromise(this.courseSlug)]).spread(function(
    response,
    courseProgress
  ) {
    if (mightRevealChangedProgress) {
      courseProgress.trigger('refresh');
    }

    return response;
  });
};

/**
 * Call a naptime get() on a resource whose ids are the [[CourseItemId]]s for this client's `itemMetadata`.
 *
 * @param {string} resource The name of the naptime resource.
 * @param {object} args The URI arguments.
 * @param {boolean} mightRevealChangedProgress Whether calling this might have an affect on course progress.
 * @returns Promise for the request.
 */
NaptimeItemClient.prototype.getWithCourseItemId = function(resource, args, mightRevealChangedProgress) {
  const id = stringKeyTuple.tupleToStringKey([this.courseId, this.itemId]);

  return this.get(resource, id, args, mightRevealChangedProgress);
};

/**
 * Call a naptime get() on a resource whose ids are the [[UserCourseItemId]]s for this client's `itemMetadata` and for
 * the current logged in user.
 *
 * @param {string} resource The name of the naptime resource.
 * @param {object} args The URI arguments.
 * @param {boolean} mightRevealChangedProgress Whether calling this might have an affect on course progress.
 * @returns Promise for the request.
 */
NaptimeItemClient.prototype.getWithUserCourseItemId = function(resource, args, mightRevealChangedProgress) {
  const userId = user.get().id;
  const id = stringKeyTuple.tupleToStringKey([userId.toString(), this.courseId, this.itemId]);

  return this.get(resource, id, args, mightRevealChangedProgress);
};

/**
 * Call a naptime finder.
 *
 * @param {string} resource The name of the naptime resource.
 * @param {string} finderName The name of the finder for the naptime resource.
 * @param {object} args The URI arguments.
 * @param {boolean} mightRevealChangedProgress Whether calling this might have an affect on course progress.
 * @returns Promise for the request.
 */
NaptimeItemClient.prototype.finder = function(resource, finderName, args, mightRevealChangedProgress) {
  const uri = makeUri(resource, _({ q: finderName }).extend(args || {}));

  return Q.all([api.get(uri.toString()), memoizedCourseProgressPromise(this.courseSlug)]).spread(function(
    response,
    courseProgress
  ) {
    if (mightRevealChangedProgress) {
      courseProgress.trigger('refresh');
    }

    return response;
  });
};

/**
 * Call a naptime action.
 *
 * @param {string} resource The name of the naptime resource.
 * @param {string} action The name of the action for the naptime resource.
 * @param {object} args The URI arguments.
 * @returns Promise for the request.
 */
NaptimeItemClient.prototype.action = function(resource, action, args) {
  const uri = makeUri(resource, _({ action }).extend(args || {}));

  return api.post(uri.toString());
};

export default NaptimeItemClient;
