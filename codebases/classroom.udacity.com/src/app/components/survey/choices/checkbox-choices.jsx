import { Checkbox } from '@udacity/veritas-components';
import { OtherCheckbox } from './other-field';
import PropTypes from 'prop-types';
import { SURVEY_TEXTS } from 'constants/survey';
import styles from './checkbox-choices.scss';

@cssModule(styles)
export class CheckboxChoices extends React.Component {
  static displayName = 'survey/choices/checkbox-choices';

  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    onResponseSelected: PropTypes.func.isRequired,
    response: PropTypes.object, // or null https://github.com/facebook/react/issues/3163
  };

  handleCheckboxSelected(value, idx, isOtherField = false) {
    const { onResponseSelected, response } = this.props;
    const noneIdx = this.getNoneIndex(response);

    if (_.isEmpty(response) || value === SURVEY_TEXTS.NONE) {
      onResponseSelected({ [idx]: value });
    } else if (response[idx] === value && !isOtherField) {
      // it's already there, and that particular value, so turn it off (requires the changes to other-checkbox)
      onResponseSelected(_.omit(response, idx));
    } else {
      if (noneIdx !== -1) {
        onResponseSelected({ [idx]: value });
        return;
      }
      onResponseSelected({ ...response, [idx]: value });
    }
  }

  getNoneIndex(data) {
    return _.indexOf(_.values(data), SURVEY_TEXTS.NONE);
  }

  render() {
    const { answers, response } = this.props;

    return (
      <div styleName="checkbox-container">
        <ul styleName="answer-choices">
          {_.map(answers, (answer, idx) => {
            if (answer === SURVEY_TEXTS.OTHER_TEXT_INPUT) {
              const value = _.get(response, idx);
              return (
                <li key={idx}>
                  <OtherCheckbox
                    id={idx}
                    label={SURVEY_TEXTS.OTHER_TEXT_INPUT}
                    defaultValue={value}
                    onTextChange={(value) =>
                      this.handleCheckboxSelected(value, idx, true)
                    }
                    onInputChange={(value) =>
                      this.handleCheckboxSelected(value, idx)
                    }
                  />
                </li>
              );
            }

            return (
              <li key={idx}>
                <Checkbox
                  id={idx}
                  checked={_.includes(response, answer)}
                  label={answer}
                  onChange={() => this.handleCheckboxSelected(answer, idx)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default CheckboxChoices;
