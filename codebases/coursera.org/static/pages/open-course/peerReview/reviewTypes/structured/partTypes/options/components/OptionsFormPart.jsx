import React from 'react';
import Content from 'bundles/phoenix/components/Content';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import reviewShape from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/options/models/reviewShape';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/options/models/schema';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/OptionsFormPart';

class OptionsFormPart extends React.Component {
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

    const partId = reviewSchemaPart.get('id');
    const options = reviewSchemaPart.getSortedOptions();

    return (
      <div className="rc-OptionsFormPart">
        <div className="options-prompt">
          <Content content={reviewSchemaPart.get('prompt')} />
        </div>
        <div>
          {options.map((option) => (
            <div key={option.optionId}>
              <label className="option">
                <input
                  className="option-input"
                  disabled={disabled}
                  name={`peer-options-${partId}`}
                  value={option.optionId}
                  type="radio"
                  checked={reviewPart && option.optionId === reviewPart.definition.choice}
                  onChange={this.handleChange.bind(this, option.optionId)}
                />
                <div className="option-contents">
                  {reviewSchemaPart.get('isScored') && (
                    <div>
                      <FormattedMessage
                        message={_t('{points, plural, one{# pt} other{# pts}}')}
                        points={option.points.toString()}
                      />
                    </div>
                  )}
                  <div>
                    <Content assumeStringIsHtml={false} content={option.display} />
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default OptionsFormPart;
