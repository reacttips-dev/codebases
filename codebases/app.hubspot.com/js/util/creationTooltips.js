'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite, canWriteTemplates } from 'SequencesUI/lib/permissions';
export function getSequenceWritePermissionsTooltip() {
  return canWrite() ? null : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "sequences.missingSequencesWriteScope.createSequence"
  });
}
export function getSequenceLimitsTooltip(_ref) {
  var sequencesUsage = _ref.sequencesUsage,
      portalIsAtSequencesLimit = _ref.portalIsAtSequencesLimit;

  if (!sequencesUsage || !portalIsAtSequencesLimit) {
    return null;
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "sequences.usage.reachedSequenceLimit.portal",
    options: {
      limit: sequencesUsage.limit,
      count: sequencesUsage.count
    }
  });
}

function getTemplateWritePermissionsTooltip(_ref2) {
  var isPreMadeSequence = _ref2.isPreMadeSequence;

  if (canWriteTemplates()) {
    return null;
  }

  return isPreMadeSequence ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "sequences.missingTemplatesWriteScope.cannotCreatePreMadeSequence"
  }) : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "sequences.missingTemplatesWriteScope.createTemplate"
  });
}

function getTemplateLimitsTooltip(_ref3) {
  var templatesUsage = _ref3.templatesUsage,
      portalIsAtTemplatesLimit = _ref3.portalIsAtTemplatesLimit,
      userIsAtTemplatesLimit = _ref3.userIsAtTemplatesLimit,
      isPreMadeSequence = _ref3.isPreMadeSequence;

  if (!templatesUsage) {
    return null;
  }

  var tooltipKey;

  if (templatesUsage.error) {
    tooltipKey = 'sequencesui.cloneOptions.templatesUsageError';
  } else if (portalIsAtTemplatesLimit) {
    tooltipKey = isPreMadeSequence ? 'sequences.usage.reachedTemplateLimit.cannotCreatePreMadeSequence' : 'sequences.usage.reachedTemplateLimit.portal';
  } else if (userIsAtTemplatesLimit) {
    tooltipKey = 'sequences.usage.reachedTemplateLimit.freeUser';
  } else {
    return null;
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: tooltipKey,
    options: {
      usedCount: templatesUsage.currentUsage,
      limitCount: portalIsAtTemplatesLimit ? templatesUsage.limit : templatesUsage.userLimit
    }
  });
}

export function getCreateTemplateTooltip(_ref4) {
  var templatesUsage = _ref4.templatesUsage,
      portalIsAtTemplatesLimit = _ref4.portalIsAtTemplatesLimit,
      userIsAtTemplatesLimit = _ref4.userIsAtTemplatesLimit,
      _ref4$isPreMadeSequen = _ref4.isPreMadeSequence,
      isPreMadeSequence = _ref4$isPreMadeSequen === void 0 ? false : _ref4$isPreMadeSequen;
  return getTemplateWritePermissionsTooltip({
    isPreMadeSequence: isPreMadeSequence
  }) || getTemplateLimitsTooltip({
    templatesUsage: templatesUsage,
    portalIsAtTemplatesLimit: portalIsAtTemplatesLimit,
    userIsAtTemplatesLimit: userIsAtTemplatesLimit,
    isPreMadeSequence: isPreMadeSequence
  });
}