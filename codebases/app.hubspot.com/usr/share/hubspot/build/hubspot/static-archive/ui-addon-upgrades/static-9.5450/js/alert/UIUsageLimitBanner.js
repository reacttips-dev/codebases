'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { sources } from 'ui-addon-upgrades/_core/common/data/upgradeData/properties/sources';
import { getUpgradeDataWithSource } from 'ui-addon-upgrades/_core/utils/getUpgradeDataWithSource';
import { useDismissableWarning } from '../_core/common/hooks/useDismissableWarning';
import { upgradeDataPropsInterface } from '../_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { UsageLimitBanner } from '../_core/usageLimit/UsageLimitBanner';

var updateUpgradeData = function updateUpgradeData(props) {
  return Object.assign({}, props, {
    upgradeData: Object.assign({}, getUpgradeDataWithSource(props.upgradeData, sources.USAGE_LIMIT))
  });
};

var UIUsageLimitBanner = function UIUsageLimitBanner(props) {
  var updatedProps = updateUpgradeData(props);

  var _useDismissableWarnin = useDismissableWarning(Object.assign({}, updatedProps, {
    interactionName: 'usageLimitInteraction'
  })),
      handleClose = _useDismissableWarnin.handleClose,
      hasReachedLimit = _useDismissableWarnin.hasReachedLimit,
      showBanner = _useDismissableWarnin.showBanner;

  if (!showBanner) return null;
  return /*#__PURE__*/_jsx(UsageLimitBanner, Object.assign({}, updatedProps, {
    onClose: handleClose,
    hasReachedLimit: hasReachedLimit
  }));
};

UIUsageLimitBanner.propTypes = Object.assign({
  carouselItem: PropTypes.string,
  className: PropTypes.string,
  closeable: PropTypes.bool,
  condensed: PropTypes.bool,
  currencyCode: PropTypes.string,
  feature: PropTypes.string,
  limit: PropTypes.number.isRequired,
  linkUse: PropTypes.string,
  responsive: PropTypes.bool,
  style: PropTypes.object,
  subType: PropTypes.string,
  value: PropTypes.number.isRequired,
  warningThreshold: PropTypes.number
}, upgradeDataPropsInterface);
UIUsageLimitBanner.defaultProps = {
  closeable: false
};
export default UIUsageLimitBanner;