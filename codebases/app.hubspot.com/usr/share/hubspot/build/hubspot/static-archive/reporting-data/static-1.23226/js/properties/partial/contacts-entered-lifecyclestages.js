'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { GT } from '../../constants/operators';
import prefix from '../../lib/prefix';
import { BUCKETS } from '../../constants/property-types';
var translate = prefix('reporting-data.lifecyclestage.enteredStage');
var translateCommon = prefix('reporting-data.properties.common');

var booleanOptions = function booleanOptions() {
  return [{
    value: 'YES',
    label: translateCommon('buckets.included')
  }, {
    value: 'NO',
    label: translateCommon('buckets.excluded')
  }];
};

var createLifecycleDateProperty = function createLifecycleDateProperty(lifecyclestage) {
  return "hs_lifecyclestage_" + lifecyclestage + "_date";
};

var createEnteredCountProperty = function createEnteredCountProperty(lifecyclestage) {
  return "BUCKET_" + createLifecycleDateProperty(lifecyclestage) + "_enteredCount";
};

export default (function () {
  return List([ImmutableMap({
    label: translate('subscriber'),
    name: createEnteredCountProperty('subscriber'),
    property: createLifecycleDateProperty('subscriber'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('lead'),
    name: createEnteredCountProperty('lead'),
    property: createLifecycleDateProperty('lead'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('marketingqualifiedlead'),
    name: createEnteredCountProperty('marketingqualifiedlead'),
    property: createLifecycleDateProperty('marketingqualifiedlead'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('salesqualifiedlead'),
    name: createEnteredCountProperty('salesqualifiedlead'),
    property: createLifecycleDateProperty('salesqualifiedlead'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('opportunity'),
    name: createEnteredCountProperty('opportunity'),
    property: createLifecycleDateProperty('opportunity'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('customer'),
    name: createEnteredCountProperty('customer'),
    property: createLifecycleDateProperty('customer'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('evangelist'),
    name: createEnteredCountProperty('evangelist'),
    property: createLifecycleDateProperty('evangelist'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  }), ImmutableMap({
    label: translate('other'),
    name: createEnteredCountProperty('other'),
    property: createLifecycleDateProperty('other'),
    groupName: 'contactscripted',
    scripted: true,
    blocklistedForFiltering: true,
    options: booleanOptions(),
    type: BUCKETS,
    buckets: [{
      name: 'YES',
      operator: GT,
      value: 0
    }, {
      name: 'NO'
    }]
  })]);
});