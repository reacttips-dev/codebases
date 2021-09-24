'use es6';

import http from 'hub-http/clients/apiClient';
import { logCallingError } from 'calling-error-reporting/report/error';
import PortalIdParser from 'PortalIdParser';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import allSettled from 'hs-promise-utils/allSettled';
export var HUBSPOT_PROPERTIES = ['phone', 'mobilephone'];

function fetchContactProperties(ids) {
  return http.get('/contacts/v1/contact/vids/batch', {
    query: {
      vid: ids
    }
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Contacts CalleeProperties request failed',
      extraData: {
        error: error
      },
      tags: {
        requestName: '/contacts/v1/contact/vids/batch'
      }
    });
  }).then(function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      results: results,
      ids: ids,
      objectTypeId: CONTACT_TYPE_ID
    };
  });
}

function fetchCompanyProperties(ids) {
  return http.get('/companies/v2/companies/batch', {
    query: {
      id: ids,
      ignoreDeletes: true,
      includeAllValues: true
    }
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Companies CalleeProperties request failed',
      extraData: {
        error: error
      },
      tags: {
        requestName: '/companies/v2/companies/batch'
      }
    });
  }).then(function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      results: results,
      ids: ids,
      objectTypeId: COMPANY_TYPE_ID
    };
  });
}

export function fetchCalleeProperties(_ref) {
  var contactIds = _ref.contactIds,
      companyIds = _ref.companyIds;
  var promises = [];

  if (companyIds.length) {
    promises.push(fetchCompanyProperties(companyIds));
  }

  if (contactIds.length) {
    promises.push(fetchContactProperties(contactIds));
  }

  return allSettled(promises);
}
export function addPhoneNumberPropertyAPI(propertyName) {
  var url = 'users/v1/app/attributes';
  var query = {
    key: "Integrations:Twilio:PhoneProperties:" + PortalIdParser.get()
  };
  return http.get(url, {
    query: query
  }).then(function (response) {
    var properties = [];

    if (response.attributes && response.attributes.length) {
      var propertiesString = response.attributes[0].value;
      properties = JSON.parse(propertiesString);
    }

    if (!properties.includes(propertyName)) {
      properties.push(propertyName);
      return http.post(url, {
        query: query,
        data: Object.assign(query, {
          value: JSON.stringify(properties.filter(function (item) {
            return !!item;
          }))
        })
      });
    }

    return Promise.resolve();
  });
}
export function updatePhoneNumberPropertyAPI(objectId, objectTypeId, property, value, userEmail) {
  var baseURI = objectTypeId === CONTACT_TYPE_ID ? "contacts/v1/contact/vid/" + objectId + "/profile" : "companies/v2/companies/" + objectId;
  var request = objectTypeId === CONTACT_TYPE_ID ? http.post : http.put;
  var recordSpecificData = objectTypeId === CONTACT_TYPE_ID ? {
    vid: objectId
  } : {
    companyId: Number(objectId)
  };
  var recordPropertySpecificData = objectTypeId === CONTACT_TYPE_ID ? {
    property: property,
    'source-id': userEmail
  } : {
    name: property,
    sourceId: userEmail
  };
  recordPropertySpecificData.value = value;
  recordPropertySpecificData.source = 'CRM_UI'; // This can't change?

  return request(baseURI, {
    data: Object.assign({}, recordSpecificData, {
      properties: [recordPropertySpecificData]
    })
  });
}
export function removePhoneNumberPropertyAPI(_ref2) {
  var propertyName = _ref2.propertyName;
  var url = 'users/v1/app/attributes';
  var query = {
    key: "Integrations:Twilio:PhoneProperties:" + PortalIdParser.get()
  };
  return http.get(url, {
    query: query
  }).then(function (response) {
    var properties = [];

    if (response.attributes && response.attributes.length) {
      var propertiesString = response.attributes[0].value;
      properties = JSON.parse(propertiesString);
    }

    if (properties.includes(propertyName) && !HUBSPOT_PROPERTIES.includes(propertyName)) {
      var updatedProperties = properties.reduce(function (acc, property) {
        if (propertyName !== property) {
          acc.push(property);
        }

        return acc;
      }, []);
      var data = Object.assign(query, {
        value: JSON.stringify(updatedProperties)
      });
      return http.post(url, {
        query: query,
        data: data
      });
    }

    return Promise.resolve();
  });
}
export function addPhoneNumberPropertyAndUpdate(_ref3) {
  var objectId = _ref3.objectId,
      objectTypeId = _ref3.objectTypeId,
      property = _ref3.property,
      rawValue = _ref3.rawValue,
      userEmail = _ref3.userEmail;
  return addPhoneNumberPropertyAPI(property).then(function () {
    return updatePhoneNumberPropertyAPI(objectId, objectTypeId, property, rawValue, userEmail);
  });
}