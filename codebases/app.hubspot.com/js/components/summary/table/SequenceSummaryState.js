'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceEmailErrorTypes from 'SequencesUI/constants/SequenceEmailErrorTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils.js';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import UITag from 'UIComponents/tag/UITag';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UnenrolledByWorkflowTooltipContent from './UnenrolledByWorkflowTooltipContent';
import sequenceEmailErrorType from 'SequencesUI/util/sequenceEmailErrorType';
import EmailLabelPopover from './EmailLabelPopover';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { EXECUTING, FINISHED, PAUSED, UNENROLLED } from 'SequencesUI/constants/SummaryFilterTypes';
import { ACCOUNT_MEETING, ACCOUNT_REPLY, ERROR, MANUAL, WORKFLOW, MEETING, REPLY, THREAD_REPLY, SEQUENCE_DELETED } from 'SequencesUI/constants/UnenrolledSourceTypes';

function FormattedLabel(_ref) {
  var label = _ref.label;
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "summary.sequenceSummarySearchEngagement." + label
  });
}

FormattedLabel.displayName = 'FormattedLabel';
FormattedLabel.propTypes = {
  label: PropTypes.string.isRequired
};

var SequenceSummaryState = function SequenceSummaryState(_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      isProcessing = _ref2.isProcessing;

  if (isProcessing) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  }

  var enrollmentState = getPropertyValue(sequenceEnrollment, 'hs_enrollment_state');

  switch (enrollmentState) {
    case EXECUTING:
      {
        if (!getPropertyValue(sequenceEnrollment, 'hs_last_executed_step_order')) {
          return /*#__PURE__*/_jsx(UITag, {
            use: "warning",
            children: /*#__PURE__*/_jsx(FormattedLabel, {
              label: "SCHEDULED"
            })
          });
        }

        return /*#__PURE__*/_jsx(UITag, {
          use: "thunderdome",
          children: /*#__PURE__*/_jsx(FormattedLabel, {
            label: enrollmentState
          })
        });
      }

    case PAUSED:
      return /*#__PURE__*/_jsx(UITag, {
        use: "warning",
        children: /*#__PURE__*/_jsx(FormattedLabel, {
          label: getPropertyValue(sequenceEnrollment, 'hs_dependency_type') === SequenceStepDependencyTypes.TASK_COMPLETION ? 'WAITING_ON_TASK' : 'PAUSED_BY_USER'
        })
      });

    case FINISHED:
      return /*#__PURE__*/_jsx(UITag, {
        use: "warning",
        children: /*#__PURE__*/_jsx(FormattedLabel, {
          label: enrollmentState
        })
      });

    case UNENROLLED:
      {
        var unenrolledSource = getPropertyValue(sequenceEnrollment, 'hs_unenrolled_source');

        switch (unenrolledSource) {
          case MANUAL:
          case REPLY:
          case THREAD_REPLY:
          case SEQUENCE_DELETED:
            return /*#__PURE__*/_jsx(UITag, {
              use: "calypso",
              children: /*#__PURE__*/_jsx(FormattedLabel, {
                label: unenrolledSource
              })
            });

          case WORKFLOW:
            {
              var ContentRenderer = function ContentRenderer() {
                return /*#__PURE__*/_jsx(UnenrolledByWorkflowTooltipContent, {
                  workflowId: getPropertyValue(sequenceEnrollment, 'hs_unenrolled_by_workflow_id'),
                  sequenceId: getPropertyValue(sequenceEnrollment, 'hs_sequence_id')
                });
              };

              return /*#__PURE__*/_jsx(UITooltip, {
                Content: ContentRenderer,
                children: /*#__PURE__*/_jsx(UITag, {
                  use: "calypso",
                  children: /*#__PURE__*/_jsx(FormattedLabel, {
                    label: unenrolledSource
                  })
                })
              });
            }

          case MEETING:
            return /*#__PURE__*/_jsx(UITag, {
              use: "success",
              children: /*#__PURE__*/_jsx(FormattedLabel, {
                label: unenrolledSource
              })
            });

          case ACCOUNT_REPLY:
          case ACCOUNT_MEETING:
            return /*#__PURE__*/_jsx(UITooltip, {
              title: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "summary.sequenceSummarySearchEngagement.tooltip." + unenrolledSource
              }),
              children: /*#__PURE__*/_jsx(UITag, {
                use: unenrolledSource === ACCOUNT_REPLY ? 'calypso' : 'success',
                children: /*#__PURE__*/_jsx(FormattedLabel, {
                  label: unenrolledSource
                })
              })
            });

          case ERROR:
            {
              var stepErrorType = getPropertyValue(sequenceEnrollment, 'hs_step_error_type');

              if (!stepErrorType) {
                stepErrorType = SequenceEmailErrorTypes.OTHER;

                if (window.newrelic) {
                  window.newrelic.addPageAction('sequences-ui: undefined enrollment step error type', {
                    id: getPropertyValue(sequenceEnrollment, 'hs_enrollment_id'),
                    portalId: PortalIdParser.get()
                  });
                }
              }

              var _sequenceEmailErrorTy = sequenceEmailErrorType(stepErrorType),
                  errorTagName = _sequenceEmailErrorTy.errorTagName,
                  errorMessage = _sequenceEmailErrorTy.errorMessage,
                  link = _sequenceEmailErrorTy.link;

              return /*#__PURE__*/_jsx(EmailLabelPopover, {
                errorMessage: errorMessage,
                link: link,
                children: /*#__PURE__*/_jsx(UITag, {
                  use: "danger",
                  children: /*#__PURE__*/_jsx(FormattedMessage, {
                    message: "util.sequenceEmailErrorType." + errorTagName
                  })
                })
              });
            }

          default:
            return null;
        }
      }

    default:
      return null;
  }
};

SequenceSummaryState.propTypes = {
  sequenceEnrollment: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired
};
export default SequenceSummaryState;