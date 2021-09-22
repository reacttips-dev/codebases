import React from 'react';
import _ from 'underscore';
import Content from 'bundles/phoenix/components/Content';
import reviewShape from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/yesNo/models/reviewShape';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/yesNo/models/schema';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/YesNoFormPart';

class YesNoFormPart extends React.Component {
  static propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    reviewSchemaPart: React.PropTypes.instanceOf(ReviewSchemaPart).isRequired,
    reviewPart: reviewShape,
    onChange: React.PropTypes.func,
  };

  handleChange = (optionId) => {
    if (!this.props.disabled && this.props.onChange) {
      this.props.onChange({ choice: optionId });
    }
  };

  render() {
    const { disabled, reviewSchemaPart, reviewPart } = this.props;

    const options = [
      {
        label: 'Yes',
      },
      {
        label: 'No',
      },
    ];

    return (
      <div className="rc-YesNoFormPart">
        <div className="options-prompt">
          <Content assumeStringIsHtml={false} content={reviewSchemaPart.get('prompt')} />
        </div>
        <div>
          {options.map((option) => (
            <div key={option.label}>
              <label className="option">
                <input
                  className="option-input"
                  disabled={disabled}
                  value={option.label}
                  type="radio"
                  checked={reviewPart && option.label === reviewPart.definition.choice}
                  onChange={_(this.handleChange).partial(option.label)}
                />
                <div className="option-contents">
                  {reviewSchemaPart.get('points') && (
                    <div>
                      <FormattedMessage
                        message={_t('{points, plural, one{# pt} other{# pts}}')}
                        points={reviewSchemaPart.getChoicePoints(option.label)}
                      />
                    </div>
                  )}
                  <div>{option.label}</div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default YesNoFormPart;
