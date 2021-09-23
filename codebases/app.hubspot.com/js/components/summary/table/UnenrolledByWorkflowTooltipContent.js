'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { getWorkflowUrl } from 'SequencesUI/lib/links';
import UILink from 'UIComponents/link/UILink';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import { registerQuery, useQuery } from 'data-fetching-client';
import { fetchFlowIdsForSequenceIncludingDeleted } from 'SequencesUI/api/SequenceWorkflowManagementApi';
export var GET_SEQUENCE_WORKFLOW_IDS_INCLUDING_DELETED = registerQuery({
  fieldName: 'sequenceWorkflowIdsIncludingDeleted',
  args: ['sequenceId'],
  fetcher: fetchFlowIdsForSequenceIncludingDeleted
});

function getTooltipMessage(_ref) {
  var workflowLinkText = _ref.workflowLinkText,
      workflowId = _ref.workflowId;
  return /*#__PURE__*/_jsx(FormattedJSXMessage, {
    message: "summary.sequenceSummarySearchEngagement.tooltip.WORKFLOW_jsx",
    options: {
      workflowName: workflowLinkText,
      linkProps: {
        external: true,
        href: getWorkflowUrl(workflowId)
      }
    },
    elements: {
      Link: UILink
    }
  });
}

var UnenrolledByWorkflowTooltipContent = function UnenrolledByWorkflowTooltipContent(_ref2) {
  var sequenceId = _ref2.sequenceId,
      workflowId = _ref2.workflowId,
      workflowName = _ref2.workflowName;

  var _useQuery = useQuery(GET_SEQUENCE_WORKFLOW_IDS_INCLUDING_DELETED, {
    variables: {
      sequenceId: sequenceId
    }
  }),
      loading = _useQuery.loading,
      error = _useQuery.error,
      data = _useQuery.data;

  if (isLoading(workflowName) || loading) {
    return /*#__PURE__*/_jsx(UITooltipContent, {
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        size: "extra-small",
        use: "on-dark"
      })
    });
  }

  var tooltipMessage = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "summary.sequenceSummarySearchEngagement.tooltip.WORKFLOW_unknown"
  });

  if (isError(workflowName) && workflowId) {
    tooltipMessage = getTooltipMessage({
      workflowLinkText: workflowId,
      workflowId: workflowId
    });
  }

  if (isResolved(workflowName)) {
    tooltipMessage = getTooltipMessage({
      workflowLinkText: workflowName.label,
      workflowId: workflowId
    });
  }

  if (!loading && !error && data.sequenceWorkflowIdsIncludingDeleted.includes(parseInt(workflowId, 10))) {
    tooltipMessage = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchEngagement.tooltip.WORKFLOW_contextual_automation"
    });
  }

  return /*#__PURE__*/_jsx(UITooltipContent, {
    children: tooltipMessage
  });
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    workflowName: resolvers[ReferenceObjectTypes.AUTOMATION_PLATFORM_WORKFLOWS].byId(props.workflowId)
  };
};

var UnenrolledByWorkflowTooltipContentWithResolver = ResolveReferences(mapResolversToProps)(UnenrolledByWorkflowTooltipContent);
UnenrolledByWorkflowTooltipContentWithResolver.propTypes = {
  workflowId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired
};
UnenrolledByWorkflowTooltipContentWithResolver.defaultProps = {
  workflowId: ''
};
export default UnenrolledByWorkflowTooltipContentWithResolver;