import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CloudfrontApi from 'js/lib/cloudfront.api';
import Coursera from 'js/lib/coursera';
import language from 'js/lib/language';
import University from 'js/models/university';

const Universities = Backbone.Collection.extend({
  model: University,

  comparator(university) {
    return language.latinizeText(university.get('name')).toLowerCase();
  },

  getNamesString() {
    return stringifyList(this.models.map((model) => model.get('name')));
  },

  getUnlocalizedNamesString() {
    return stringifyList(this.models.map((model) => model.getUnlocalizedName()));
  },
});

let deferred;

// Use this static method to access front page data.
// It returns a jQuery Deferred object so you can attach listeners
// using done(), fail(), etc.
// On the first call to this function, it will start an asynchronous
// Backbone read(). Future calls will just return the existing Deferred object.
// If several callers use Universities.singletonRead() there will be
// only 1 network request and the data will be reused.
Universities.singletonRead = function () {
  if (deferred) {
    return deferred;
  }

  // TODO(josh): Use deferred.then when we upgrade to jQuery 1.8.
  deferred = $.Deferred();
  const cloudfrontApi = CloudfrontApi(Coursera.api, Coursera.config);
  cloudfrontApi
    .get('university/list')
    .done(function (jsonData) {
      deferred.resolve(new Universities(jsonData));
    })
    .fail(function (xhr, status, err) {
      deferred.reject(xhr, status, err);
      Coursera.router.trigger('error', 500, location.href, {
        message: 'error loading universities: ' + err,
      });
    });
  return deferred;
};

Universities.groupByPartnerType = function (universities) {
  return _.groupBy(universities.toArray(), function (uni) {
    return uni.get('partner_type') || 1;
  });
};

Universities.getNormalPartners = function (universities) {
  return Universities.groupByPartnerType(universities)[1] || [];
};

Universities.getStateSystems = function (universities) {
  return Universities.groupByPartnerType(universities)[2] || [];
};

export default Universities;
