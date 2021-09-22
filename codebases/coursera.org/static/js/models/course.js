import Backbone from 'backbone';
import _ from 'underscore';
import constants from 'js/json/constants';
import _tTopics from 'i18n!js/json/nls/topics';
import Coursera from 'js/lib/coursera';
import util from 'js/lib/util';
import moment from 'moment';

const loadTopic = () => import('js/models/topic');

/* We cache moment functionality that takes up significant time in the browser */
const MomentCache = {
  moments: {},
  today: null,
  formats: {},
  fromNows: {},
  diffs: {},
  getMomentFor(arr) {
    const key = arr.join('/');
    if (!MomentCache.moments[key]) {
      const momentFor = moment(arr);
      if (momentFor.isValid()) {
        MomentCache.moments[key] = momentFor;
      }
    }
    return MomentCache.moments[key];
  },
  getFormatted(momentObj, formatString) {
    const key = momentObj.valueOf() + '|' + formatString;
    if (!MomentCache.formats[key]) {
      MomentCache.formats[key] = momentObj.format(formatString);
    }
    return MomentCache.formats[key];
  },
  getDiffFromToday(momentObj) {
    if (!MomentCache.today) {
      MomentCache.today = moment(new Date());
    }
    const key = momentObj.valueOf();
    if (!MomentCache.diffs[key]) {
      MomentCache.diffs[key] = momentObj.diff(MomentCache.today, 'days');
    }
    return MomentCache.diffs[key];
  },
  getFromNow(momentObj, withoutSuffix) {
    if (!MomentCache.today) {
      MomentCache.today = moment(new Date());
    }
    const key = momentObj.valueOf();
    if (!MomentCache.fromNows[key]) {
      MomentCache.fromNows[key] = momentObj.from(MomentCache.today, withoutSuffix);
    }
    return MomentCache.fromNows[key];
  },
  getFormattedDateString(dateValue) {
    if (dateValue) {
      return MomentCache.getFormatted(moment(dateValue), 'LL');
    } else {
      return '';
    }
  },
};

const course = Backbone.Model.extend({
  defaults: {},

  initialize() {
    this.bind('change', this.updateComputed, this);
    this.updateComputed();
  },

  get(key) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);

    switch (key) {
      case 'name':
        return _tTopics(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName() {
    this.constructor.__super__.get.apply(this, 'name');
  },

  updateComputed() {
    // We must require it here due to Topic requiring Courses
    loadTopic().then((TopicModule) => {
      const Topic = TopicModule.default;
      if (this.get('topic') && !(this.get('topic') instanceof Topic)) {
        this.set('topic', new Topic(this.get('topic')), {
          silent: true,
        });
      }

      if (this.has('topic') && this.get('topic').get('self_service_course_id') === this.get('id')) {
        this.set('self_study', true, { silent: true });
      }
      if (this.get('topic')) {
        this.set(
          'optin_link',
          Coursera.config.dir.home + 'signature/course/' + this.get('topic').get('short_name') + '/' + this.get('id'),
          {
            silent: true,
          }
        );
      }
      if (this.get('home_link')) {
        this.set('class_link', this.get('home_link') + 'auth/auth_redirector?type=login&subtype=normal', {
          silent: true,
        });
      }

      if (this.get('signature_track_price')) {
        const realPrice = this.get('signature_track_price');
        this.set('signature_track_price_display', Number(realPrice).toFixed(2), {
          silent: true,
        });
        const regularPrice = this.get('signature_track_regular_price');
        this.set('signature_track_regular_price', Number(regularPrice).toFixed(2), {
          silent: true,
        });
        const discountAmount = regularPrice - realPrice;
        if (discountAmount > 0) {
          this.set('signature_track_price_discount', Number(discountAmount).toFixed(2), {
            silent: true,
          });
        }
      }
      this.set('duration', this.get('duration_string'), {
        silent: true,
      });
    });
  },

  passClass() {
    const courseRecord = this.get('record');
    const gradeLevel = !!courseRecord.achievement_level && courseRecord.achievement_level > 0;
    return gradeLevel && this.certificateIsReady();
  },

  /**
   * To get a signature track certificate, you must:
   *   1. pass authentication threshold (which is indicated by authenticated_overall)
   *   either:
   *      2a. Pass the ACE requirements
   *      2b. Get a passing course grade using normal OR distinction policies
   * */
  getsSignatureTrackCert() {
    const courseRecord = this.get('record');
    const certsReady = this.certificateIsReady();
    const isSigTrack = this.get('eligible_for_signature_track') && courseRecord && courseRecord.signature_track;
    if (certsReady && isSigTrack) {
      const normalOrDistinction =
        !_.isUndefined(courseRecord.achievement_level) &&
        courseRecord.achievement_level &&
        courseRecord.achievement_level > 0;
      const passedACE = courseRecord.passed_ace && courseRecord.is_enrolled_for_proctored_exam;
      return courseRecord.authenticated_overall && (normalOrDistinction || passedACE);
    } else {
      return false;
    }
  },

  // To get an SOA, you must get a passing course grade using normal OR distinction policies
  getsSOA() {
    const courseRecord = this.get('record');
    const certsReady = this.certificateIsReady();
    const isEligible = this.get('eligible_for_certificates');

    return (
      certsReady &&
      courseRecord &&
      isEligible &&
      !_.isNull(courseRecord.achievement_level) &&
      !_.isUndefined(courseRecord.achievement_level) &&
      courseRecord.achievement_level > 0
    );
  },

  hasGrade() {
    return this.getsSOA() || this.getsSignatureTrackCert();
  },

  hasStatement() {
    return this.certificateIsReady() && this.get('record') && this.get('record').achievement_level > 0;
  },

  isEligibleForSignatureTrack() {
    return this.get('eligible_for_signature_track');
  },

  isOpen() {
    return this.get('status') === 1;
  },

  isSignatureTrackOpen() {
    return this.get('signature_track_registration_open');
  },

  isFlexjoin() {
    return this.get('eligible_for_flexjoin') || _.contains(constants.flexjoin_course_ids, this.get('id'));
  },

  getDurationWeeks() {
    let durationWeeks = 1000;
    if (this.get('duration_string')) {
      const durationStr = this.get('duration_string');
      const durationWeeksNum = parseInt(durationStr.split(' ')[0], 10);
      if (!isNaN(durationWeeksNum) && durationWeeksNum >= 1) {
        durationWeeks = durationWeeksNum;
      }
    }
    return durationWeeks;
  },

  /**
   * Hack to pseudo-translate the bits that can't be translated right now.
   * @param  {string} languageCode string language code ex. zh-tw, zh-cn
   * @return {string} duration string in language
   */
  getDurationString(languageCode) {
    if (_(['zh-cn']).contains(languageCode)) {
      return this.getDurationWeeks() + '周';
    } else {
      return this.get('duration_string');
    }
  },

  // Either they specify no fields (TBA),
  // or they specify month and year,
  // or they specify everything
  hasPartialDate() {
    return !!(this.get('start_year') && this.get('start_month') && !this.get('start_day'));
  },

  hasFullDate() {
    return !!(this.get('start_year') && this.get('start_month') && this.get('start_day'));
  },

  getStartDateMoment() {
    let startDateM = null;
    if (this.hasPartialDate()) {
      startDateM = MomentCache.getMomentFor([this.get('start_year'), this.get('start_month') - 1]);
    } else if (this.hasFullDate()) {
      startDateM = MomentCache.getMomentFor([
        this.get('start_year'),
        this.get('start_month') - 1,
        this.get('start_day'),
        0,
        0,
        0,
      ]);
    }
    return startDateM;
  },

  getEndDateMoment() {
    let endDateM = null;
    const startMoment = this.getStartDateMoment();
    if (this.get('end_date')) {
      endDateM = moment(this.get('end_date'), 'YYYY-MM-DD');
    } else if (startMoment) {
      endDateM = moment(startMoment).add(this.getDurationWeeks(), 'weeks');
    }
    return endDateM;
  },

  getStartTime() {
    const startDateM = this.getStartDateMoment();
    return startDateM ? startDateM.valueOf() : null;
  },

  getStartDisplay() {
    let startDisplay = 'Date to be announced';
    if (this.get('self_study')) {
      startDisplay = 'Self study';
    } else if (this.hasPartialDate()) {
      startDisplay = MomentCache.getFormatted(this.getStartDateMoment(), 'MMMM YYYY');
    } else if (this.hasFullDate()) {
      startDisplay = MomentCache.getFormatted(this.getStartDateMoment(), 'LL');
    }

    return startDisplay;
  },

  getStartDisplayShort() {
    let startDisplayShort = 'Date TBA';
    if (this.get('self_study')) {
      startDisplayShort = 'Self study';
    } else if (this.hasPartialDate()) {
      startDisplayShort = MomentCache.getFormatted(this.getStartDateMoment(), 'MMM YYYY');
    } else if (this.hasFullDate()) {
      startDisplayShort = MomentCache.getFormatted(this.getStartDateMoment(), 'MMM Do');
    }
    return startDisplayShort;
  },

  getEndTime() {
    const endMoment = this.getEndDateMoment();
    if (endMoment != null) {
      return endMoment.valueOf();
    } else {
      return null;
    }
  },

  getEndDisplay() {
    let endDisplay = 'Date to be announced';
    const endDateM = this.getEndDateMoment();
    if (this.get('self_study')) {
      endDisplay = '';
    } else if (endDateM) {
      endDisplay = MomentCache.getFormatted(endDateM, 'LL');
    } else if (this.hasPartialDate()) {
      endDisplay = MomentCache.getFormatted(endDateM, 'MMMM YYYY');
    } else if (this.hasFullDate()) {
      endDisplay = MomentCache.getFormatted(endDateM, 'LL');
    }
    return endDisplay;
  },

  getEndDisplayShort(fmt) {
    if (!fmt) {
      fmt = 'll';
    }
    const endMoment = this.getEndDateMoment();
    if (endMoment != null) {
      return MomentCache.getFormatted(endMoment, fmt);
    } else {
      return '';
    }
  },

  getSuperCustomChineseOnlyTranslatedCoursesDisplay() {
    // When removing this, please remove the identical function from bundles/catalogP/models/session
    // as well as removing all usages.
    return this.isChineseOnly() ? '(Chinese/中文版) ' : '';
  },

  getStartDiff() {
    let startDiff = 99999999;
    const startDateM = this.getStartDateMoment();
    if (startDateM) {
      startDiff = MomentCache.getDiffFromToday(startDateM);
    }
    return startDiff;
  },

  getEndDiff() {
    let endDiff = 99999999;
    const endDateM = this.getEndDateMoment();
    if (endDateM) {
      endDiff = MomentCache.getDiffFromToday(endDateM);
    }
    return endDiff;
  },

  getStartPercent() {
    let startPercent = 0;
    const startDateM = this.getStartDateMoment();
    if (startDateM) {
      const startDiff = MomentCache.getDiffFromToday(startDateM);
      const totalDuration = startDateM.diff(this.getEndDateMoment(), 'days');
      startPercent = Math.min(Math.abs(Math.ceil((startDiff / totalDuration) * 100)), 100);
    }
    return startPercent;
  },

  getStartCountdown() {
    let startCountdown = '';
    const startDateM = this.getStartDateMoment();
    const startStatus = this.getStartStatus();
    if (startDateM) {
      const startDiff = MomentCache.getDiffFromToday(startDateM);
      if (startStatus == 'present' && startDiff === 0) {
        startCountdown = 'Starting soon';
      } else if (startStatus == 'present' && startDiff < 0) {
        startCountdown = 'Started ' + MomentCache.getFromNow(startDateM);
      } else if (startStatus == 'past') {
        startCountdown = 'Ended ' + MomentCache.getFromNow(this.getEndDateMoment());
      } else {
        startCountdown = 'Starts ' + MomentCache.getFromNow(startDateM);
      }
    }
    return startCountdown;
  },

  getStartStatus() {
    if (this.get('self_study')) {
      return 'present';
    }
    const startDateM = this.getStartDateMoment();
    if (startDateM === null) {
      return 'future';
    }

    const startDiff = MomentCache.getDiffFromToday(startDateM);
    const endDateM = this.getEndDateMoment();
    if (endDateM == null) {
      return startDiff > 0 ? 'future' : 'present';
    }

    const endDiff = MomentCache.getDiffFromToday(endDateM);
    if (startDiff > 0 && endDiff > 0) {
      return 'future';
    } else if (startDiff < 0 && endDiff < 0) {
      return 'past';
    } else if (startDiff <= 0 && endDiff >= 0) {
      return 'present';
    }
  },

  getDashboardStartStatus() {
    const startStatus = this.getStartStatus();
    if (startStatus === 'future' || startStatus === 'present') {
      return startStatus;
    } else if (startStatus === 'past') {
      const startDateM = this.getStartDateMoment();
      const startDiff = MomentCache.getDiffFromToday(startDateM);
      const endDateM = this.getEndDateMoment();
      const endDiff = MomentCache.getDiffFromToday(endDateM);

      if (startDiff < 0 && endDiff < 0) {
        return 'past';
      } else if (startDiff <= 0 && endDiff >= 0) {
        return 'present';
      }
    }
  },

  getCourseButtonState() {
    const startStatus = this.getStartStatus();
    const isActive = this.get('active');
    const isUserEnrolled = this.get('user_is_enrolled');
    const isSelfStudy = this.get('self_study');
    const isPast = startStatus === 'past';
    const isPresent = startStatus === 'present';
    const isFuture = startStatus === 'future';
    const isCertReady = this.certificateIsReady();
    const userGetsSigtrack = this.getsSignatureTrackCert();
    const isCertEligible = this.get('eligible_for_certificates') || userGetsSigtrack;
    const courseHasSOA = this.hasStatement();
    const courseRecordLink = '/accomplishments';
    const specialization = this.get('topic').getSpecialization();
    const userHasSpecialization = !!(specialization && Coursera.user.getSpecializationBulkVoucher(specialization.id));

    const priorities = {
      GO_TO_CLASS: 1,
      JOIN: 2,
      JOIN_FOR_FREE: 3,
      VIEW_CLASS_ARCHIVE: 4,
      COUNTDOWN: 5,
      VIEW_COURSE_RECORD: 6,
      GRADING_IN_PROGRESS: 7,
      GRADING_IN_PROGRESS_VIEW_ARCHIVE: 8,
    };

    const state = {
      // links to class page by default, is override when we want to send people
      // to the course records page
      link: this.get('class_link'),
      // default button
      text: 'JOIN_FOR_FREE',
      // default action color, rendering handled in template
      color: 'blue',
      // disable for special cases like classes with no grades or waiting to start
      disabled: false,
      // only use on the authenticated home page
      tooltip: '',
      // used on the course landing page to determine the ordering of the dropdown.
      priority: 4,
    };

    if (this.get('topic').isFlaggedForNoPaymentSpecialization() || userHasSpecialization) {
      state.text = 'JOIN';
    }

    if (!isUserEnrolled) {
      return state;
    } else if (isSelfStudy || (isActive && !isPast)) {
      // User is enrolled, class is active or self study
      // class may be starting in the past, present or future.
      state.color = 'green';
      if (isPast) {
        state.text = 'VIEW_CLASS_ARCHIVE';
      } else {
        state.text = 'GO_TO_CLASS';
      }
    } else if (!isActive && (isFuture || isPresent)) {
      // user enrolled, class not active, class in the future
      state.text = 'COUNTDOWN';
      state.color = 'green';
      state.disabled = true;
    } else if (isPast) {
      // the class is no longer active, the user is enrolled, and the class is
      // not in the future. Time to determine accomplishments and records.
      state.color = 'blue';
      state.text = 'VIEW_COURSE_RECORD';
      state.link = courseRecordLink;

      if (isCertEligible) {
        if (isCertReady) {
          if (userGetsSigtrack) {
            state.tooltip = 'CONGRATS_GET_VC';
          } else if (courseHasSOA) {
            state.tooltip = 'CONGRATS_GET_SOA';
          } else {
            state.tooltip = 'DID_NOT_GET_SOA_GET_GRADE';
          }
        } else if (isActive) {
          // Course is in the past but still active
          state.link = this.get('class_link');
          state.text = 'GRADING_IN_PROGRESS_VIEW_ARCHIVE';
          state.tooltip = 'GRADING_IN_PROGRESS_VIEW_ARCHIVE';
        } else {
          // course is over, is eligible for certs but they're not ready
          state.text = 'GRADING_IN_PROGRESS';
          state.tooltip = 'GRADING_IN_PROGRESS';
          state.disabled = true;
        }
      } else {
        // class isnt cert eligible
        if (isCertReady) {
          // there is a weird case where certs aren't eligible but are ready. What this means
          // is that there's no SOA but grades are visible.
          state.tooltip = 'GET_YOUR_GRADE';
        } else {
          state.tooltip = 'COURSE_NO_SOA';
          state.disabled = true;
        }
      }
    }

    state.priority = priorities[state.text];
    return state;
  },

  getSignatureTrackRegistrationTimeLeft() {
    return MomentCache.getFromNow(moment(this.get('signature_track_close_time')), true);
  },

  getSignatureTrackPaymentDeadline() {
    return MomentCache.getFormattedDateString(this.get('signature_track_close_time'));
  },

  getSignatureTrackRefundEndDate() {
    return MomentCache.getFormattedDateString(this.get('signature_track_refund_deadline'));
  },

  getFlexjoinPaymentDeadline() {
    return MomentCache.getFormattedDateString(this.get('flexjoin_payment_close_time'));
  },

  getSignatureTrackProfileCompletionDate() {
    return MomentCache.getFormattedDateString(this.get('signature_track_profile_creation_cutoff'));
  },

  certificateIsReady() {
    return (
      this.get('certificates_ready') &&
      this.get('auth_review_completion_date') != null &&
      this.get('end_of_class_emails_sent') != null
    );
  },

  /**
   * Exists for the fully translated course experience experiment.
   */
  isChineseOnly() {
    // When removing this, please remove the identical function from bundles/catalogP/models/session
    // as well as removing all usages.
    if (!this.has('topic')) {
      return false;
    }
    const chineseOnlySessionIds = _(constants.chineseOnlyTopicToCourses).chain().values().flatten().value();

    return !!_(chineseOnlySessionIds).contains(this.get('id'));
  },

  /**
   * For voucher deprecation, we are no longer giving course refund vouchers
   * for courses that start after May 1 2015.
   */
  canGetCourseRefundVouchers() {
    return this.getStartDateMoment().isBefore('2015-05-01');
  },
});

export default course;
