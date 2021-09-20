import CategoryRankChoices from 'components/survey/choices/category-rank-choices';
import CheckboxChoices from 'components/survey/choices/checkbox-choices';
import PropTypes from 'prop-types';
import Question from './question';
import RadioChoices from 'components/survey/choices/radio-choices';
import RankChoices from 'components/survey/choices/rank-choices';
import SurveyShape from './survey-shape';
import { TYPES } from 'constants/survey';
import { __ } from 'services/localization-service';
import styles from './question-slide.scss';

@cssModule(styles)
export class QuestionSlide extends React.Component {
  static displayName = 'survey/question-slide';

  static propTypes = {
    survey: SurveyShape.isRequired,
    isLast: PropTypes.bool,
    onResponseSelected: PropTypes.func,
    response: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    isLast: false,
  };

  handleResponseSelected = (response = null) => {
    const {
      survey: { question },
      onResponseSelected,
    } = this.props;
    onResponseSelected(question, response);
  };

  renderChoices() {
    const {
      survey: { question, answers, type, labels, range, categories },
      response,
    } = this.props;

    switch (type) {
      case TYPES.RADIO:
        return (
          <RadioChoices
            answers={answers}
            onResponseSelected={this.handleResponseSelected}
            response={response}
          />
        );
      case TYPES.CHECKBOX:
        return (
          <CheckboxChoices
            question={question}
            answers={answers}
            onResponseSelected={this.handleResponseSelected}
            response={response}
          />
        );
      case TYPES.RATING:
        return (
          <RankChoices
            labels={labels}
            range={range}
            onResponseSelected={this.handleResponseSelected}
            response={response}
          />
        );
      case TYPES.CATEGORY_RATING:
        return (
          <CategoryRankChoices
            categories={categories}
            labels={labels}
            range={range}
            onResponseSelected={this.handleResponseSelected}
            response={response}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { survey, isLast } = this.props;

    return (
      <Question nextButtonLabel={isLast ? __('Done') : __('Next')}>
        <h1 styleName="question-text">{survey.question}</h1>
        <div styleName="answer-container">{this.renderChoices()}</div>
      </Question>
    );
  }
}

export default QuestionSlide;
