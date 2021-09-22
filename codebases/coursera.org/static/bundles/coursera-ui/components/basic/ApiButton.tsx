import PropTypes from 'prop-types';
import React from 'react';
import { color } from '@coursera/coursera-ui';
import {
  API_BEFORE_SEND,
  apiStatusPropType,
  errorPropType,
} from 'bundles/coursera-ui/constants/apiNotificationConstants';

import withApiStatusUIInfo from 'bundles/coursera-ui/components/hocs/withApiStatusUIInfo';
import { BUTTON_TYPES } from 'bundles/coursera-ui/components/basic/Button';
import SvgButton from 'bundles/coursera-ui/components/basic/SvgButton';
import SvgLoaderSignal from 'bundles/coursera-ui/components/svg/coursera/common/SvgLoaderSignal';
import SvgCheckSolid from 'bundles/coursera-ui/components/svg/coursera/common/SvgCheckSolid';
import SvgCircleWarning from 'bundles/coursera-ui/components/svg/coursera/common/SvgCircleWarning';

const SvgButtonWithApiStatus = withApiStatusUIInfo(SvgButton);

/**
 * A Button that handles ApiStatus changes.
 */
const ApiButton = ({
  apiStatus: apiStatusAlt,
  disableApiStatus,
  apiStatusAttributesConfig = {},
  apiStatusHtmlAttributesConfig = {},
  isThemeDark,
  children,
  style = {},
  type = 'secondary',

  iconAttributes = {
    size: 18,
  },

  ...rest
}: $TSFixMe) => {
  const apiStatus = disableApiStatus ? API_BEFORE_SEND : apiStatusAlt;

  const baseIconProps = {
    ...iconAttributes,
    isThemeDark,
  };

  const baseApiBtnStyle = { ...style, backgroundColor: 'transparent' };
  if (type === 'icon') {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'borderColor' does not exist on type '{ b... Remove this comment to see the full error message
    baseApiBtnStyle.borderColor = 'transparent';
  }

  return (
    // @ts-ignore ts-migrate(2741) FIXME: Property 'htmlAttributes' is missing in type '{ ap... Remove this comment to see the full error message
    <SvgButtonWithApiStatus
      apiStatus={apiStatus}
      isThemeDark={isThemeDark}
      type={type}
      apiStatusAttributesConfig={{
        style: {
          API_BEFORE_SEND: style,
          API_IN_PROGRESS: {
            color: isThemeDark ? color.disabledThemeDark : color.disabled,
            borderColor: isThemeDark ? color.disabledThemeDark : color.disabled,
            ...baseApiBtnStyle,
          },
          API_SUCCESS: {
            color: color.success,
            borderColor: color.success,
            ...baseApiBtnStyle,
          },
          API_ERROR: {
            color: color.danger,
            borderColor: color.danger,
            ...baseApiBtnStyle,
          },
        },
        svgElement: {
          API_BEFORE_SEND: children,
          // @ts-ignore ts-migrate(2322) FIXME: Type '{ isThemeDark: any; size: number; color: str... Remove this comment to see the full error message
          API_IN_PROGRESS: <SvgLoaderSignal color={isThemeDark ? color.white : color.white} {...baseIconProps} />,
          API_SUCCESS: <SvgCheckSolid color={color.success} {...baseIconProps} />,
          API_ERROR: <SvgCircleWarning color={color.danger} {...baseIconProps} />,
        },
        ...apiStatusAttributesConfig,
      }}
      apiStatusHtmlAttributesConfig={{
        disabled: {
          API_BEFORE_SEND: false,
          API_IN_PROGRESS: true,
          API_SUCCESS: true,
          API_ERROR: true,
        },
        ...apiStatusHtmlAttributesConfig,
      }}
      {...rest}
    />
  );
};

ApiButton.propTypes = {
  // Default icon
  children: PropTypes.node,
  apiStatus: apiStatusPropType,
  disableApiStatus: PropTypes.bool,
  isThemeDark: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(BUTTON_TYPES)),
  /* eslint-disable react/forbid-prop-types */
  apiStatusAttributesConfig: PropTypes.object,
  apiStatusHtmlAttributesConfig: PropTypes.object,
  iconAttributes: PropTypes.object,
  style: PropTypes.object,
  /* eslint-disable react/forbid-prop-types */
};

export default ApiButton;

export { apiStatusPropType, errorPropType };
