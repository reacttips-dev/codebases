'use es6';

import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import get from 'transmute/get';
import indexBy from 'transmute/indexBy';
import enviro from 'enviro';
var hardCodedResponse = enviro.isProd() ? [{
  label: 'Eventbrite',
  value: '28564'
}, {
  label: 'GoToWebinar',
  value: '35161'
}, {
  label: 'Zoom',
  value: '178192'
}] : [{
  label: 'Eventbrite',
  value: '1159843'
}, {
  label: 'GoToWebinar',
  value: '1158066'
}, {
  label: 'Zoom',
  value: '1162897'
}];
export var createGetAllMarketingEventAppNames = function createGetAllMarketingEventAppNames() {
  return function () {
    return Promise.resolve(hardCodedResponse).then(function (response) {
      return indexBy(get('id'), formatToReferencesList({
        getId: get('value'),
        getLabel: get('label')
      }, response));
    });
  };
};
export var getAllMarketingEventAppNames = createGetAllMarketingEventAppNames();