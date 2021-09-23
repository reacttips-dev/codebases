'use es6';

import memoize from 'transmute/memoize';
import EmailAddressRegex from 'hubspot.PatternValidation.patterns.EmailAddress';
import DomainRegex from 'hubspot.PatternValidation.patterns.Domain';
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
import { isMultienum, isDate } from 'customer-data-objects/property/PropertyIdentifier';
import { parseMultiEnumValue } from 'customer-data-property-utils/parseMultiEnumValue';
export function isNotHubspotSupportEmail(email) {
  return !/(support\.hubspot\.com)/g.test(email);
}
export function isValidEmail(email) {
  return email && EmailAddressRegex.test(email) && isNotHubspotSupportEmail(email);
}
export var removeProtocolAndWwwPrefix = function removeProtocolAndWwwPrefix(domain) {
  if (!domain) {
    return domain;
  }

  return domain.replace(/https?:\/\//i, '').replace(/(www\.)?/i, '');
};
export function domainContainsPath(domain) {
  domain = removeProtocolAndWwwPrefix(domain);
  return domain.indexOf('/') !== -1;
}
export var getDomainPathInfo = function getDomainPathInfo(domain) {
  domain = removeProtocolAndWwwPrefix(domain);
  var match = domain.match(/([^/]*)(.*)/);
  return {
    domain: match[1],
    path: domainContainsPath(domain) ? match[2] : null
  };
};
export var getDomain = memoize(function (url) {
  if (!url) {
    return undefined;
  }

  var pathInfo = getDomainPathInfo(url);
  return pathInfo.domain;
});
export function isValidDomain(domain) {
  domain = getDomain(domain);

  if (!domain) {
    return false;
  }

  return DomainRegex.test(domain);
}
export function isValidRequiredProperties(requiredProps, propertyValues, availableProps) {
  if (!requiredProps) {
    return true;
  }

  return requiredProps.every(function (prop) {
    var value = propertyValues.get(prop);
    var valueAsString = "" + value;
    var propertyType = availableProps.getIn([prop, 'type']);
    var hasExternalOptions = availableProps.getIn([prop, 'externalOptions']);
    var isValid;

    if (propertyType === ENUMERATION && !hasExternalOptions) {
      var values = isMultienum(availableProps.get(prop).toJS()) ? parseMultiEnumValue(valueAsString) : [valueAsString];
      var options = availableProps.getIn([prop, 'options']);
      isValid = options.some(function (option) {
        return values.includes(option.get('value'));
      });
    } else {
      var trimmedValue;

      if (valueAsString) {
        trimmedValue = valueAsString.trim();
      }

      isValid = value !== undefined && value !== null && trimmedValue && trimmedValue.length > 0;
    }

    return isValid;
  });
}
export function isValidPropertyValue(property, value) {
  if (value && isDate(property)) {
    return !isNaN(Number(value));
  }

  return true;
}