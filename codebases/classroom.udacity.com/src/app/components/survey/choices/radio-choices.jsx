import { OtherRadio } from './other-field';
import PropTypes from 'prop-types';
import { Radio } from '@udacity/veritas-components';
import { SURVEY_TEXTS } from 'constants/survey';
import { __ } from 'services/localization-service';
import styles from './radio-choices.scss';

@cssModule(styles)
export class RadioChoices extends React.Component {
  static displayName = 'survey/radio-choices';

  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    onResponseSelected: PropTypes.func,
    response: PropTypes.object,
  };

  handleSelectAnswer = (answer, enableUnselect = true) => {
    const { onResponseSelected, response } = this.props;

    // unselect
    if (answer === response && enableUnselect) {
      return onResponseSelected();
    }

    return onResponseSelected(answer);
  };

  render() {
    const { answers, response } = this.props;

    return (
      <ul styleName="answer-choices">
        {_.map(answers, (answer, index) => {
          if (_.isEqual(SURVEY_TEXTS.OTHER_TEXT_INPUT, answer)) {
            const value = !_.includes(answers, response) ? response : null;
            return (
              <li key={index}>
                <OtherRadio
                  id={index}
                  label={SURVEY_TEXTS.OTHER_TEXT_INPUT}
                  defaultValue={value}
                  onInputChange={(value) => this.handleSelectAnswer(value)}
                  onTextChange={(value) =>
                    this.handleSelectAnswer(value, false)
                  }
                />
              </li>
            );
          }

          return (
            <li key={index}>
              <Radio
                checked={response === answer}
                id={index}
                label={__(answer)}
                onChange={() => this.handleSelectAnswer(answer)}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

export default RadioChoices;
