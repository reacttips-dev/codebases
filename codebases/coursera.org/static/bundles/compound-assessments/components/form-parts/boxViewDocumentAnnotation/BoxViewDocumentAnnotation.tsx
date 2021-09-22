import React from 'react';
import initBem from 'js/lib/bem';
import { P, color, Box, SvgButton } from '@coursera/coursera-ui';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import _t from 'i18n!nls/compound-assessments';
import { SvgCompose } from '@coursera/coursera-ui/svg';

import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { typeNames } from 'bundles/compound-assessments/constants';
import type {
  BoxViewDocumentAnnotationPrompt,
  BoxViewDocumentAnnotationResponse,
} from 'bundles/compound-assessments/types/FormParts';

import InlineSubmissionTool from './InlineSubmissionTool';

import 'css!./__styles__/BoxViewDocumentAnnotation';

const bem = initBem('BoxViewDocumentAnnotation');
const ICON_SIZE = 20;

type Props = {
  prompt: BoxViewDocumentAnnotationPrompt;
  responseId: string;
  showValidation: boolean;
  courseId: string;
  itemId: string;
  userId: number;
  isReadOnly: boolean;
  onChangeResponse: (response: BoxViewDocumentAnnotationResponse) => void;
  isExpanded?: boolean;
};

type State = {
  showTool: boolean;
};

export const checkInvalid = (): FormPartsValidationStatus | null => {
  return null;
};

class BoxViewDocumentAnnotation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showTool: props.isExpanded || false };
  }

  componentDidMount() {
    this.markAnnotationAsCompletedIfNecessary();
  }

  markAnnotationAsCompletedIfNecessary = () => {
    const { onChangeResponse, isReadOnly } = this.props;
    const { showTool } = this.state;

    if (showTool && !isReadOnly) {
      onChangeResponse({
        typeName: typeNames.REVIEW_RESPONSE,
        definition: {
          reviewPart: {
            typeName: 'boxViewDocumentAnnotation',
            definition: {
              annotationComplete: true,
              fileId: '',
            },
          },
        },
      });
    }
  };

  toggleTool = () => {
    this.setState(
      ({ showTool }) => ({
        showTool: !showTool,
      }),
      () => this.markAnnotationAsCompletedIfNecessary()
    );
  };

  render() {
    const { prompt, responseId, courseId, itemId, userId, isReadOnly } = this.props;
    const { showTool } = this.state;

    if (!prompt) {
      return null;
    }

    const editText = isReadOnly ? _t('View inline feedback') : _t('Give inline feedback');

    return (
      <div className={bem()}>
        <P tag="div" rootClassName={bem('prompt')}>
          <CMLOrHTML value={prompt.promptContent} />
        </P>
        {showTool ? (
          <div className={bem('tool-embed')}>
            <InlineSubmissionTool
              reviewResponseId={responseId}
              courseId={courseId}
              itemId={itemId}
              userId={userId}
              annotationsDisabled={isReadOnly}
            />
          </div>
        ) : (
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
      </div>
    );
  }
}

export default BoxViewDocumentAnnotation;
