'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPortalIsAtLimit as getPortalIsAtSequencesLimit, getPortalIsAtTemplatesLimit, getUserIsAtTemplatesLimit } from 'SequencesUI/selectors/usageSelectors';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import { getSequenceWritePermissionsTooltip, getSequenceLimitsTooltip, getCreateTemplateTooltip } from 'SequencesUI/util/creationTooltips';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { trackViewSequencesPermissionTooltip, trackViewTemplatesPermissionTooltip } from '../../util/UsageTracker';
import { canWrite, canWriteTemplates } from 'SequencesUI/lib/permissions';

var useHandlePermissionTooltipOpenChange = function useHandlePermissionTooltipOpenChange(subscreen) {
  return useCallback(function (_ref) {
    var open = _ref.target.value;

    if (open) {
      if (!canWrite()) {
        trackViewSequencesPermissionTooltip(subscreen);
      } else {
        trackViewTemplatesPermissionTooltip();
      }
    }
  }, [subscreen]);
};

var CreateSequenceTooltip = function CreateSequenceTooltip(_ref2) {
  var children = _ref2.children,
      _ref2$involvesCreatin = _ref2.involvesCreatingTemplates,
      involvesCreatingTemplates = _ref2$involvesCreatin === void 0 ? false : _ref2$involvesCreatin,
      placement = _ref2.placement,
      sequencesUsage = _ref2.sequencesUsage,
      templatesUsage = _ref2.templatesUsage,
      portalIsAtSequencesLimit = _ref2.portalIsAtSequencesLimit,
      portalIsAtTemplatesLimit = _ref2.portalIsAtTemplatesLimit,
      userIsAtTemplatesLimit = _ref2.userIsAtTemplatesLimit,
      fetchSequencesUsage = _ref2.fetchSequencesUsage,
      fetchTemplateUsage = _ref2.fetchTemplateUsage,
      subscreen = _ref2.subscreen;
  useEffect(function () {
    if (!sequencesUsage) {
      fetchSequencesUsage();
    }

    if (!templatesUsage) {
      fetchTemplateUsage();
    }
  }, [fetchSequencesUsage, fetchTemplateUsage, sequencesUsage, templatesUsage]);
  var handlePermissionTooltipOpenChange = useHandlePermissionTooltipOpenChange(subscreen);
  var onOpenChange = canWrite() && (canWriteTemplates() || !involvesCreatingTemplates) ? undefined : handlePermissionTooltipOpenChange;
  var tooltipTitle = getSequenceWritePermissionsTooltip() || getSequenceLimitsTooltip({
    sequencesUsage: sequencesUsage,
    portalIsAtSequencesLimit: portalIsAtSequencesLimit
  }) || involvesCreatingTemplates && getCreateTemplateTooltip({
    sequencesUsage: sequencesUsage,
    templatesUsage: templatesUsage,
    portalIsAtSequencesLimit: portalIsAtSequencesLimit,
    portalIsAtTemplatesLimit: portalIsAtTemplatesLimit,
    userIsAtTemplatesLimit: userIsAtTemplatesLimit,
    isPreMadeSequence: true
  });
  return tooltipTitle ? /*#__PURE__*/_jsx(UITooltip, {
    title: tooltipTitle,
    placement: placement,
    onOpenChange: onOpenChange,
    children: children
  }) : children;
};

CreateSequenceTooltip.defaultProps = {
  involvesCreatingTemplates: false
};
CreateSequenceTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  involvesCreatingTemplates: PropTypes.bool,
  placement: PropTypes.string,
  sequencesUsage: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number
  }),
  templatesUsage: PropTypes.shape({
    currentUsage: PropTypes.number,
    limit: PropTypes.number,
    userLimit: PropTypes.number,
    error: PropTypes.bool
  }),
  portalIsAtSequencesLimit: PropTypes.bool.isRequired,
  portalIsAtTemplatesLimit: PropTypes.bool,
  userIsAtTemplatesLimit: PropTypes.bool,
  fetchSequencesUsage: PropTypes.func.isRequired,
  fetchTemplateUsage: PropTypes.func.isRequired,
  subscreen: PropTypes.string.isRequired
};
export default connect(function (state) {
  return {
    templatesUsage: state.templatesUsage,
    sequencesUsage: state.sequencesUsage,
    portalIsAtSequencesLimit: getPortalIsAtSequencesLimit(state),
    portalIsAtTemplatesLimit: getPortalIsAtTemplatesLimit(state),
    userIsAtTemplatesLimit: getUserIsAtTemplatesLimit(state),
    fetchSequencesUsage: SequenceActions.fetchSequencesUsage,
    fetchTemplateUsage: TemplateActions.fetchTemplateUsage
  };
})(CreateSequenceTooltip);