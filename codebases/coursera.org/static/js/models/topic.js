/* eslint-disable */
import Backbone from 'backbone';

import $ from 'jquery';
import _ from 'underscore';
import stringifyList from 'bundles/catalogP/lib/stringifyList';
import Courses from 'js/collections/courses';
import constants from 'js/json/constants';
import _tTopics from 'i18n!js/json/nls/topics';
import Coursera from 'js/lib/coursera';
import language from 'js/lib/language';
import path from 'js/lib/path';
import util from 'js/lib/util';

// Used to hardcode special ST cert image URLs
var ST_CERT_EXCEPTIONS = {};

var Topic = Backbone.Model.extend({
  defaults: {},

  idAttribute: 'short_name',

  initialize: function () {
    this.bind('change', this.updateComputed, this);
    this.updateComputed();
  },

  get: function (key) {
    var parentValue = this.constructor.__super__.get.apply(this, arguments);

    switch (key) {
      case 'name':
        return _tTopics(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName: function () {
    this.constructor.__super__.get.apply(this, 'name');
  },

  updateComputed: function () {
    var self = this;
    if (this.get('universities') && this.get('universities').length == 1 && !this.get('universities')[0]) {
      this.set('universities', []);
    }

    if (!this.get('courses') || !(this.get('courses') instanceof Courses)) {
      this.set('courses', new Courses(this.get('courses')), { silent: true });
      this.get('courses').each(function (course) {
        if (!course.get('topic') || !(course.get('topic') instanceof Topic)) {
          course.set('topic', self);
        }
      });
    }

    if (this.get('short_description')) {
      this.set('short_description', this.get('short_description').replace(/(<([^>]+)>)/gi, ''), { silent: true });
    }

    this.set('social_link', Coursera.config.url.base + 'course/' + this.get('short_name'), { silent: true });

    if (!this.get('hash_tag')) {
      var hashTag = this.get('short_name');
      // customize hash tags
      // if this becomes prevalent we'll have to add a new field in topic model
      if (hashTag == 'gamification') hashTag = 'gamification14'; // See SADMIN-303
      if (hashTag == 'totalleadership') hashTag = 'TotalLeadership14'; // See WWW-656
      this.set('hash_tag', hashTag, { silent: true });
    }

    if (this.get('universities') && this.get('universities').length == 1) {
      this.set('uni_twitter', this.get('universities')[0].website_twitter, { silent: true });
    }

    // Pick the open course that starts the soonest
    var coursesByTime = Courses.byTime(this.get('courses'));
    var openCourse = _.find(coursesByTime, function (course) {
      return course.isOpen();
    });

    this.set('open_course', openCourse, { silent: true });

    var instructors = [];
    if (!openCourse) {
      _.each(coursesByTime, function (course) {
        if (course.get('instructors') && course.get('instructors').length) {
          instructors = course.get('instructors');
        }
      });
    } else {
      instructors = openCourse.get('instructors');
    }
    // This is the set of instructors to show when the instructors are displayed for a topic not within the
    // context of a session
    this.set('instructors', instructors, { silent: true });

    this.set('universities_display', util.prettyJoin(_.pluck(this.get('universities'), 'name')), { silent: true });

    var language_group = language.toLanguageCode(this.get('language'));
    this.set('language_group', language_group, { silent: true });
    this.set('language_name', language.languageCodeToName(this.get('language')), { silent: true });

    var nativeAndSubtitles = language_group + ',' + (this.get('subtitle_languages_csv') || '');
    this.set('subtitle_language_groups', nativeAndSubtitles, { silent: true });

    // This is a short term solution; this will be a column/property of the topic
    // in the future. - JW
    if (_(constants['openCourses']).contains(this.get('short_name'))) {
      this.set('on-demand', true, {
        silent: true,
      });
    }
  },

  sync: function (callback) {
    var that = this;
    if (this.get('has_full_data')) {
      callback();
    } else if (this.get('short_name')) {
      $.when(
        Coursera.api.get('topic/information', {
          data: {
            'topic-id': that.get('short_name'),
          },
          message: {
            waiting: 'loading course details ...',
          },
        }),
        Coursera.api.get('user/instructorprofile', {
          data: {
            topic_short_name: that.get('short_name'),
            exclude_topics: 1,
          },
          message: {
            waiting: 'loading course details...',
          },
        })
      )
        .done(function (data, instructorData) {
          that.set(data[0]);
          that.set('instructor_profiles', instructorData[0]);
          callback();
        })
        .fail(function (jqXHR) {
          callback(jqXHR.status);
        });
    }
  },

  isUpcoming: function () {
    if (this.get('open_course')) {
      return this.get('open_course').getStartDiff() > 0 && this.get('open_course').getStartDiff() < 30;
    } else {
      return false;
    }
  },

  /**
   * Determines if a session is available for Signature Track Enrollment. This is specific to a 'user'
   * This initializes `this.sessions` that fit ALL of the following criteria
   *   1. Sessions that are Eligible for Signature Track.
   *   2. Sessions that are starting in the future.
   *   3. Sessions that are either:
   *      a. A Capstone
   *      b. Course is open for sigtrack
   *      c. User is enrolled in the course and signature track is open
   *
   * @param {User} user
   */
  getCoursesAvailableForSignatureTrackEnrollment: function (user) {
    return this.get('courses').filter(
      function (course) {
        var isCapstoneOpen = this.get('is_capstone') && course.isSignatureTrackOpen();
        var isCourseOpenForSigtrack = course.isSignatureTrackOpen();
        var isUserEnrolledAndSigtrackOpen =
          user && user.isEnrolledInCourse(course.get('id')) && course.isSignatureTrackOpen();

        return (
          course.isEligibleForSignatureTrack() &&
          course.getStartStatus() !== 'past' &&
          (isCapstoneOpen || isCourseOpenForSigtrack || isUserEnrolledAndSigtrackOpen)
        );
      }.bind(this)
    );
  },

  getCourseById: function (courseId) {
    return this.get('courses').find(function (course) {
      return course.get('id') == courseId;
    });
  },

  getLink: function () {
    return path.join(Coursera.config.url.base, this.getRelativeLink());
  },

  getLinkClass: function () {
    if (this.get('on-demand')) {
      return '';
    } else {
      return 'internal-home';
    }
  },

  getRelativeLink: function () {
    if (this.get('on-demand')) {
      return path.join('/learn', this.get('short_name'));
    } else {
      return path.join('/course', this.get('short_name'));
    }
  },

  getTwitterText: function (startPhrase) {
    startPhrase = startPhrase || "I'm taking";
    var start = startPhrase + ' ' + this.get('name');
    var end = ' on @Coursera!';
    var tweetLength = start.length + end.length;
    if (this.get('social_link')) {
      tweetLength += this.get('social_link').length;
    }

    if (this.get('hash_tag')) {
      tweetLength += this.get('hash_tag').length;
    }

    if (this.get('uni_twitter') && tweetLength < 140) {
      end = ' from @' + this.get('uni_twitter') + end;
    }
    return start + end;
  },

  getFacebookText: function () {
    return "I'm taking " + this.get('name') + ' on Coursera!';
  },

  getUniqueUniversities: function () {
    return _.uniq(this.get('universities'), false, function (u) {
      return u.id;
    });
  },

  /* Tells you if any of the courses have ever had signature track */
  hasEligibleForSignatureTrack: function () {
    if (this.get('on-demand')) {
      return false;
    } else {
      return this.get('courses').any(function (course) {
        return course.isEligibleForSignatureTrack();
      });
    }
  },

  /* Tells you if any of the open courses have an open ST enrollment */
  hasOpenEnrollForSignatureTrack: function () {
    return this.get('courses').find(function (course) {
      return course.isOpen() && course.isSignatureTrackOpen();
    })
      ? true
      : false;
  },

  /* Tells you if this topic has any potential Signature Track courses starting in the future. */
  hasFutureSignatureTrackCourse: function () {
    return this.get('courses').any(function (course) {
      return (
        course.isSignatureTrackOpen() ||
        (course.getStartStatus() === 'future' &&
          course.isEligibleForSignatureTrack() &&
          (course.hasPartialDate() || course.hasFullDate()))
      );
    });
  },

  // always return the last valid cost, default to $49
  getSignatureTrackCost: function () {
    var coursesByStartTime = Courses.byTime(this.get('courses'));
    var currentAndFutureCoursesByStartTime = coursesByStartTime.filter(function (course) {
      return course.getStartStatus() !== 'past';
    });
    // not all courses have current and future sessions so we have to fall back sometimes
    return (
      _(currentAndFutureCoursesByStartTime.length !== 0 ? currentAndFutureCoursesByStartTime : coursesByStartTime)
        .chain()
        .invoke('get', 'signature_track_price')
        .compact()
        .last()
        .value() || 0
    );
  },

  getSTCertCorner: function () {
    var deferred = $.Deferred();

    // If this is a special topic (e.g. multiple schools) then use the custom URL
    if (this.get('short_name') in ST_CERT_EXCEPTIONS) {
      deferred.resolve(ST_CERT_EXCEPTIONS[this.get('short_name')].corner);
    } else if (this.get('universities') && this.get('universities').length > 0) {
      // Otherwise, use the first school in the list
      return util.getSTCertCorner(this.get('universities')[0]['short_name']);
    } else {
      // If all else fails, use the generic image
      deferred.resolve('https://s3.amazonaws.com/coursera/universities/_generic/signature-cert-corner.png');
    }

    return deferred;
  },

  getSTCertIcon: function () {
    var deferred = $.Deferred();

    // If this is a special topic (e.g. multiple schools) then use the custom URL
    if (this.get('short_name') in ST_CERT_EXCEPTIONS) {
      deferred.resolve(ST_CERT_EXCEPTIONS[this.get('short_name')].icon);
    } else if (this.get('universities') && this.get('universities').length > 0) {
      // Otherwise, use the first school in the list
      return util.getSTCertIcon(this.get('universities')[0]['short_name']);
    } else {
      // If all else fails, use the generic image
      deferred.resolve('https://s3.amazonaws.com/coursera/universities/_generic/signature-cert-icon.png');
    }

    return deferred;
  },

  getSpecialization: function () {
    return _.first(this.get('specializations') || []);
  },

  // In the case that topic is bootstrapped by topic/information, then we check topicinspecializations.is_capstone.
  // If topic is bootstrapped by specializations/info, we just check topic.get('is_capstone')
  isCapstone: function () {
    if (this.has('topicinspecializations')) {
      return _.any(this.get('topicinspecializations'), function (topicinspecializations) {
        return topicinspecializations.is_capstone;
      });
    } else {
      return this.get('is_capstone');
    }
  },

  /**
   * Get estimated workload in proper language depending no language code.
   * NOTE: Each languageCode has to be configured for now.
   * WARNING: This will be deprecating soon.
   * @param  {[type]} languageCode [description]
   * @return {[type]}              [description]
   */
  getEstimatedWorkload: function (languageCode) {
    if (_(['zh-cn']).contains(languageCode)) {
      return this.get('estimated_class_workload').replace('-', '至').replace(' hours/week', '小时，每周');
    } else {
      return this.get('estimated_class_workload');
    }
  },

  // check capstone eligibility against the data returned by /get_eligible_capstones
  checkEligibleForCapstone: function (capstoneEligibility) {
    capstoneEligibility = capstoneEligibility || {};
    return _.any(this.get('topicinspecializations'), function (topicinspecializations) {
      return capstoneEligibility[topicinspecializations.specialization_id];
    });
  },

  isFlaggedForNoPaymentSpecialization: function () {
    var specialization = this.getSpecialization();
    var specializationFlagged =
      specialization && _(constants.specializationsFlaggedForNoPayment).contains(specialization.short_name);
    var topicFlagged = _(constants.topicsFlaggedForNoPayment).contains(this.get('short_name'));
    return specializationFlagged || topicFlagged;
  },

  getUniversityNamesString: function () {
    return stringifyList(_(this.get('universities')).pluck('name'));
  },
});

Topic.getByShortName = function (shortName) {
  var topic = new Topic({ short_name: shortName });
  return topic;
};

export default Topic;
