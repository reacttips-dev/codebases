import React from 'react';
import PropTypes from 'prop-types';

import Content from 'bundles/phoenix/components/Content';
import reviewShape from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/singleLineInput/models/reviewShape';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/singleLineInput/models/schema';
import 'css!./__styles__/SingleLineInputFormPart';

type Props = {
  disabled: boolean;
  reviewSchemaPart: typeof ReviewSchemaPart;
  reviewPart?: {
    typeName: 'singleLineInput';
    definition: { input?: string };
  };
  onChange?: (change: { input: string }) => void;
};

type State = {
  inputValue?: string;
};

class SingleLineInputFormPart extends React.Component<Props, State> {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    reviewSchemaPart: PropTypes.instanceOf(ReviewSchemaPart).isRequired,
    reviewPart: reviewShape,
    onChange: PropTypes.func,
  };

  state: State = {
    inputValue: '',
  };

  constructor(props: Props, context: any) {
    super(props, context);

    if (props.reviewPart) {
      this.state = {
        inputValue: props.reviewPart.definition.input,
      };
    } else {
      this.state = {
        inputValue: '',
      };
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.reviewPart && nextProps.reviewPart !== this.props.reviewPart) {
      this.setState({
        inputValue: nextProps.reviewPart.definition.input,
      });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.props.disabled && this.props.onChange && event.target instanceof HTMLInputElement) {
      const nextValue = event.target.value || '';
      this.props.onChange({ input: nextValue });
      this.setState({
        inputValue: nextValue,
      });
    }
  };

  render() {
    const { disabled, reviewSchemaPart } = this.props;
    return (
      <div className="rc-SingleLineInputFormPart">
        <div className="singleline-prompt">
          <Content assumeStringIsHtml={false} content={reviewSchemaPart.get('prompt')} />
        </div>
        <input
          className="c-peer-review-submit-text-field"
          disabled={disabled}
          onChange={this.handleChange}
          value={this.state.inputValue}
        />
      </div>
    );
  }
}

export default SingleLineInputFormPart;
