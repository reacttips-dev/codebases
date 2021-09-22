/* eslint-disable dot-notation */
import _ from 'underscore';

import Instructors from 'js/collections/instructors';
import Topics from 'js/collections/topics';
import Universities from 'js/collections/universities';
import constants from 'js/json/constants';
import _tSpecializations from 'i18n!js/json/nls/specializations';
import config from 'js/app/config';
import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';
import prices from 'js/lib/prices';
import Coursera from 'js/lib/coursera';
import path from 'js/lib/path';
import util from 'js/lib/util';
import Backbone from 'backbone';
import s12nConstants from 'bundles/s12n-common/service/constants';

const specializationsFlaggedForPriceChange = constants.specializationsFlaggedForPriceChange;
const specializationsFlaggedForNoPayment = constants.specializationsFlaggedForNoPayment;

/**
* TODO (lewis, yang, jean): Let's figure out what to do with this.
* For 1/21 launch, we will be putting all capstone information and the video screenshot in aux_info.
* The format is as follows

{
  "keyframe": "S3 IMG URL",
  "capstone": {
    "name": "CAPSTONE COURSE NAME",
    "duration_string": "<X> weeks",
    "startDate": "Dec 12, 2014", (month must be three letters)
    "cost": "13", (no cents)
    "course_syllabus": "HTML STRING"
  }
}
* */

function parseJson(json) {
  return JSON.parse(json || '{}');
}

const _private = {
  parseAndUpdateJsonAttributes() {
    if (this.has('what_youll_learn')) {
      this.set('what_youll_learn', parseJson(this.get('what_youll_learn')), {
        silent: true,
      });
    }

    if (this.has('recommended_background')) {
      this.set('recommended_background', parseJson(this.get('recommended_background')), {
        silent: true,
      });
    }

    if (this.has('aux_info')) {
      const auxInfo = parseJson(this.get('aux_info'));
      if (!auxInfo.capstone) {
        auxInfo['capstone'] = {};
      } else if (!this.get('capstoneCost') && auxInfo['capstone']['cost']) {
        this.set('capstoneCost', auxInfo['capstone']['cost'], {
          silent: true,
        });
      }
      this.set('aux_info', auxInfo, {
        silent: true,
      });
    } else {
      this.set(
        'aux_info',
        {
          capstone: {},
        },
        {
          silent: true,
        }
      );
    }
  },

  updateTopicCollection() {
    const collection = new Topics(this.get('topics'));
    this.set('topics', collection, {
      silent: true,
    });
  },

  updateNextOpenCourse() {
    const nextOpenCourse = this.get('topics')
      .chain()
      .pluck('open_course')
      .compact()
      .reduce(function (memo, course) {
        const startDateM = course.getStartDateMoment();
        return memo === null || startDateM < memo.getStartDateMoment() ? course : memo;
      }, null)
      .value();

    if (nextOpenCourse) {
      this.set('next_open_course', nextOpenCourse, {
        silent: true,
      });
    }
  },

  updateUniversities() {
    // TODO (junjie): Hack for upenn's wharton specialization
    if (this.get('short_name') === 'whartonfoundations') {
      _(this.get('universities')).each(function (university) {
        if (university.name === 'University of Pennsylvania') {
          university.name = 'The Wharton School, University of Pennsylvania';
        }
      });
    }

    const universities = new Universities(this.get('universities'), {
      comparator: null,
    });
    this.set('universities', universities, {
      silent: true,
    });
  },

  updateInstructors() {
    const instructors = new Instructors(this.get('instructors'), {
      comparator: null,
    });
    this.set('instructors', instructors, {
      silent: true,
    });
  },
};

const Specialization = Backbone.Model.extend({
  initialize() {
    this.listenTo(this, 'change', this.updateComputed);
    this.updateComputed();
  },

  get(key) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);
    switch (key) {
      case 'name':
        return _tSpecializations(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName() {
    return this.constructor.__super__.get.apply(this, 'name');
  },

  updateComputed() {
    _private.updateTopicCollection.call(this);
    _private.updateNextOpenCourse.call(this);
    _private.updateUniversities.call(this);
    _private.updateInstructors.call(this);
    _private.parseAndUpdateJsonAttributes.call(this);
  },

  isFlaggedForPriceChange() {
    return _.contains(specializationsFlaggedForPriceChange, this.get('short_name'));
  },

  getCapstone() {
    const aux = this.get('aux_info');
    return aux && aux.capstone;
  },

  getNumOtherCourses() {
    return Math.max(this.get('topics').length - 1, 0);
  },

  getTotalCost() {
    const totalCost = this.get('topics').reduce(
      function (total, topic, i, topics) {
        if (i === topics.length - 1) {
          // capstone is always the last course
          return total + this.getCapstoneCost();
        } else {
          return total + topic.getSignatureTrackCost();
        }
      }.bind(this),
      0
    );
    return totalCost;
  },

  getFirstCourseCost() {
    const firstCourse = this.get('topics').first();
    return (firstCourse && firstCourse.getSignatureTrackCost()) || 0;
  },

  getCapstoneCost() {
    const capstone = this.get('topics').last();
    const cost = capstone && capstone.getSignatureTrackCost();
    return cost || this.get('capstoneCost') || 0;
  },

  getCourseCost() {
    let costForOtherCourses;
    if (this.isFlaggedForPriceChange()) {
      costForOtherCourses = this.getTotalCost() - this.getFirstCourseCost();
    } else {
      costForOtherCourses = this.getTotalCost() - this.getCapstoneCost();
    }
    return Math.floor(costForOtherCourses / this.getNumOtherCourses());
  },

  getUniversityNamesString() {
    const institutionNames = this.get('universities').map(function (university) {
      return university.get('name');
    });

    return util.prettyJoin(institutionNames, {
      symbol: true,
    });
  },

  getShortnameMap() {
    return this.get('universities')
      .chain()
      .map(function (university) {
        return [university.get('name'), university.get('short_name')];
      })
      .reduce(function (map, nameToShortName) {
        map[nameToShortName[0]] = nameToShortName[1];
        return map;
      }, {})
      .value();
  },

  getUniversityLogos() {
    if (this.get('cert_logo')) {
      return [this.get('cert_logo')];
    }

    const logos = this.get('universities')
      .chain()
      .map(
        function (university) {
          const omitLogo = this.get('aux_info')['omit_logo'];
          const showLogo = !omitLogo || omitLogo.indexOf(university.get('id')) < 0;

          if (showLogo) {
            return university.get('logo') || university.get('class_logo');
          }
        }.bind(this)
      )
      .compact()
      .value();

    return logos;
  },

  /**
   * Sometimes specializations have a square logo override
   */
  getSquareLogo() {
    const squareLogoOverride = this.get('aux_info') && this.get('aux_info')['square_logo_override'];
    if (squareLogoOverride) {
      return squareLogoOverride[this.get('id')];
    } else {
      return null;
    }
  },

  sync(callback) {
    const self = this;
    const data = {
      data: {
        currency: prices.getCurrencyFromCountry(requestCountryCode),
        origin: requestCountryCode,
      },
      message: {
        waiting: 'loading specialization details ...',
      },
    };
    if (this.get('has_full_data')) {
      callback();
    } else if (this.get('preview')) {
      Coursera.api
        .get('specialization/preview_info/' + this.get('id'), data)
        .done(function (data) {
          self.set('has_full_data', true, {
            silent: true,
          });
          self.set(data);
          callback();
        })
        .fail(function (jqXHR) {
          callback(jqXHR.status);
        });
    } else if (this.get('id')) {
      Coursera.api
        .get('specialization/info/' + this.get('id'), data)
        .done(function (data) {
          self.set('has_full_data', true, {
            silent: true,
          });
          self.set(data);
          callback();
        })
        .fail(function (jqXHR) {
          callback(jqXHR.status);
        });
    }
  },

  getLink() {
    return path.join(config.dir.home, s12nConstants.s12nRoot, this.get('short_name'));
  },

  getPaymentLink() {
    if (this.get('display')) {
      return path.join('/specialization/payment', this.get('short_name'), this.id);
    } else {
      return '#';
    }
  },

  isFlaggedForNoPayment() {
    return _.contains(specializationsFlaggedForNoPayment, this.get('short_name'));
  },
});

Specialization.getById = function (id) {
  return new Specialization({
    id,
  });
};

export default Specialization;
