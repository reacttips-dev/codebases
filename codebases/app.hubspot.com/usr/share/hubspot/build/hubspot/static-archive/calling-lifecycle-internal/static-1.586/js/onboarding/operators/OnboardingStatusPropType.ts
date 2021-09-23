import PropTypes from 'prop-types';
import * as OnboardingStatuses from '../constants/onboardingStatuses';
export var OnboardingStatusPropType = PropTypes.oneOf(Object.keys(OnboardingStatuses));