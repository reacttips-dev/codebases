/* eslint-disable react/forbid-prop-types, no-param-reassign */
import PropTypes from 'prop-types';

import React from 'react';
import _ from 'lodash';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

import { API_BEFORE_SEND } from 'bundles/phoenix/components/ApiNotification';

/**
 * Extract the attributes from the config object
 */
const extractAttributesByApiStatus = ({ config, apiStatus }: $TSFixMe) => {
  return _.reduce(
    config,
    (total, item, key) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      total[key] = item[apiStatus];
      return total;
    },
    {}
  );
};

/**
 * A HOC to customize UI display based on the configs of different apiStatus
 * It works well with Button, but can also be applied to any kinds of component
 * Separate the config into attributes and htmlAttributes for clarity
 */
const withApiStatusUIInfo = (Component: $TSFixMe) => {
  const HOC = ({
    apiStatus = API_BEFORE_SEND,
    apiStatusAttributesConfig = {},
    apiStatusHtmlAttributesConfig = {},
    htmlAttributes,
    ...props
  }: $TSFixMe) => {
    // Extract the attributes based on the apiStatus and add to the component props
    const attributesByApiStatus = extractAttributesByApiStatus({
      apiStatus,
      config: apiStatusAttributesConfig,
    });
    const htmlAttributesByApiStatus = extractAttributesByApiStatus({
      apiStatus,
      config: apiStatusHtmlAttributesConfig,
    });
    const htmlAttributesLocal = {
      ...htmlAttributes,
      ...htmlAttributesByApiStatus,
    };

    const htmlAttributesProp = _.isEmpty(htmlAttributesLocal) ? {} : { htmlAttributes: htmlAttributesLocal };

    return <Component {...props} {...attributesByApiStatus} {...htmlAttributesProp} />;
  };

  HOC.propTypes = {
    apiStatus: PropTypes.string,
    apiStatusAttributesConfig: PropTypes.object,
    apiStatusHtmlAttributesConfig: PropTypes.object,
    htmlAttributes: PropTypes.object,
  };

  const componentName = Component.displayName || Component.name;
  HOC.displayName = `withApiStatusUIInfo(${componentName})`;

  hoistNonReactStatics(HOC, Component);
  return HOC;
};

export default withApiStatusUIInfo;
