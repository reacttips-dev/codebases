import { MultiLineStructuredPart, MultiLineStructuredPartDefinition } from 'bundles/assess-common/types/Reviews';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Content from 'bundles/phoenix/components/Content';

import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/multiLineInput/models/schema';

import NumericInput from 'bundles/author-common/components/NumericInput';

import _t from 'i18n!nls/assess-common';

import 'css!./__styles__/MultiLineInputFormPart';

type Props = {
  disabled: boolean;
  reviewSchemaPart: typeof ReviewSchemaPart;
  reviewPart?: MultiLineStructuredPart;
  onChange?: (change: MultiLineStructuredPartDefinition) => void;
};

type State = {
  score: number | undefined | null;
  textareaValue: string;
};

class MultiLineInputFormPart extends React.Component<Props, State> {
  state: State = {
    score: undefined,
    textareaValue: '',
  };

  constructor(props: Props) {
    super(props);

    if (props.reviewPart) {
      this.state = {
        score: props.reviewPart.definition.score,
        textareaValue: props.reviewPart.definition.input || '',
      };
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.reviewPart && nextProps.reviewPart !== this.props.reviewPart) {
      this.setState({
        score: nextProps.reviewPart.definition.score,
        textareaValue: nextProps.reviewPart.definition.input || '',
      });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLElement>) => {
    if (!this.props.disabled && this.props.onChange && event.target instanceof HTMLTextAreaElement) {
      const textareaValue = event.target.value || '';
      this.props.onChange({ input: textareaValue });
      this.setState({ textareaValue });
    }
  };

  handleChangeScore = (score: number) => {
    if (!this.props.disabled && this.props.onChange) {
      // Scores under 0 are disallowed by the `NumericInput` component
      const windowedScore = Math.min(score, this.props.reviewSchemaPart.getMaxScore());
      if (this.props.onChange) {
        this.props.onChange({ score: windowedScore });
      }
      this.setState({ score: windowedScore });
    }
  };

  render() {
    const { disabled, reviewSchemaPart } = this.props;
    const promptId = reviewSchemaPart.id + '-prompt';

    return (
      <div className="rc-MultiLineInputFormPart">
        <div className="multiline-prompt">
          <Content contentId={promptId} content={reviewSchemaPart.get('prompt')} />
        </div>
        {reviewSchemaPart.isScored() && (
          <div className="horizontal-box align-items-vertical-center" style={{ marginTop: 12, marginBottom: 12 }}>
            <div className="color-secondary-text label-text" style={{ marginRight: 12 }}>
              <FormattedMessage message={_t('Score (out of {points})')} points={reviewSchemaPart.getMaxScore()} />
            </div>
            <NumericInput
              disabled={disabled}
              initialValue={this.state.score}
              min={0}
              max={reviewSchemaPart.getMaxScore()}
              allowDecimal={false}
              allowNegative={false}
              onChange={this.handleChangeScore}
              ariaLabel={_t('Enter score here')}
              ariaDescribedBy={promptId}
            />
          </div>
        )}
        <textarea
          className="c-peer-review-submit-textarea-field"
          disabled={disabled}
          onChange={this.handleChange}
          value={this.state.textareaValue}
          aria-label={_t('Enter text here')}
          aria-describedby={promptId}
        />
      </div>
    );
  }
}

export default MultiLineInputFormPart;
