import React from 'react';
import initBem from 'js/lib/bem';

import { color, Box, SvgButton } from '@coursera/coursera-ui';
import { SvgCompose } from '@coursera/coursera-ui/svg';
import Content from 'bundles/phoenix/components/Content';
import InlineSubmissionTool from 'bundles/author-assignment-grading/components/staff-graded-projects/components/submissionTool/InlineSubmissionTool';

import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/BoxAnnotationFormPart';

import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/boxAnnotation/models/schema';
import {
  BoxViewDocumentAnnotationPart,
  BoxViewDocumentAnnotationPartDefinition,
} from 'bundles/assess-common/types/Reviews';
import OnDemandStaffGradedSubmissionsV3 from 'bundles/naptimejs/resources/onDemandStaffGradedSubmissions.v3';

const bem = initBem('BoxAnnotationFormPart');
const ICON_SIZE = 20;

type Props = {
  disabled: boolean;
  reviewSchemaPart: ReviewSchemaPart;
  submission: OnDemandStaffGradedSubmissionsV3;
  reviewPart?: BoxViewDocumentAnnotationPart;
  onChange?: (change: BoxViewDocumentAnnotationPartDefinition) => void;
};

type State = {
  showTool: boolean;
};

class BoxAnnotationFormPart extends React.Component<Props, State> {
  state = {
    showTool: false,
  };

  componentDidUpdate(prevProps: Props) {
    const { submission } = this.props;

    if (prevProps.submission.submittedBy !== submission.submittedBy) {
      this.setState({ showTool: false });
    }
  }

  markComplete = () => {
    const { onChange, reviewPart } = this.props;

    if (onChange && reviewPart) {
      const newReviewPart = {
        fileId: reviewPart.definition.fileId || '',
        annotationComplete: true,
        ...(reviewPart.definition.responseId ? { responseId: reviewPart.definition.responseId } : {}),
      };
      onChange(newReviewPart);
    }
  };

  toggleTool = () => {
    const { reviewPart } = this.props;
    const isComplete = !!(reviewPart && reviewPart.definition.annotationComplete);

    if (!isComplete) {
      this.markComplete();
    }

    this.setState(({ showTool }) => ({ showTool: !showTool }));
  };

  render() {
    const { disabled, reviewSchemaPart, submission } = this.props;
    const { showTool } = this.state;
    const reviewPartId = reviewSchemaPart.id;
    const editText = disabled ? _t('View inline feedback') : _t('Give inline feedback');

    return (
      <div className={bem()}>
        <div className={bem('title') + ' label-text color-secondary-text'}>{_t('Inline Feedback')}</div>
        <div className={bem('prompt')}>
          <Content content={reviewSchemaPart.get('prompt')} />
        </div>
        {!showTool && (
          <div className={bem('edit-open-control')}>
            <Box alignItems="center">
              <SvgButton
                type="icon"
                size="zero"
                svgElement={<SvgCompose size={ICON_SIZE} color={color.primary} />}
                onClick={this.toggleTool}
              >
                <div className={bem('edit-open-text')}>{editText}</div>
              </SvgButton>
            </Box>
          </div>
        )}
        {showTool && (
          <div className={bem('tool-embed')}>
            <InlineSubmissionTool
              submission={submission}
              reviewPartId={reviewPartId}
              annotationsDisabled={disabled}
              showPopupButton={true}
            />
          </div>
        )}
      </div>
    );
  }
}

export default BoxAnnotationFormPart;
