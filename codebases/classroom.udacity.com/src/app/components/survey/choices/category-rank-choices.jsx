import { Button, TextInput } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { SURVEY_TEXTS } from 'constants/survey';
import { __ } from 'services/localization-service';
import styles from './category-rank-choices.scss';

@cssModule(styles, { allowMultiple: true })
export class CategoryRankChoices extends React.Component {
  static displayName = 'survey/choices/category-rank-choices';

  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    range: PropTypes.number.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onResponseSelected: PropTypes.func.isRequired,
    response: PropTypes.objectOf(PropTypes.string),
  };

  handleRankSelected = (value, category) => {
    this.props.onResponseSelected({
      ...this.props.response,
      [category]: value,
    });
  };

  renderCategoryRankChoices(category) {
    if (category === SURVEY_TEXTS.OTHER_TEXT_INPUT) {
      const { response } = this.props;
      return (
        <div styleName="other-input-container">
          <span styleName="other-text">{SURVEY_TEXTS.OTHER_TEXT_INPUT}:</span>
          <TextInput
            label={SURVEY_TEXTS.OTHER_TEXT_INPUT}
            hiddenLabel
            value={_.get(response, 'other')}
            placeholder={__('What else is important?')}
            onChange={(e) => this.handleRankSelected(e.target.value, 'other')}
          />
        </div>
      );
    } else {
      return this.renderRanks(category);
    }
  }

  renderRanks(category) {
    const { range, response } = this.props;
    const selected = _.get(response, category);

    return _.map(_.times(range), (idx) => {
      const value = _.toString(idx + 1);
      return (
        <Button
          key={`choice-${idx}`}
          variant={selected === value ? 'primary' : 'secondary'}
          small
          label={value}
          onClick={() => this.handleRankSelected(value, category)}
        />
      );
    });
  }

  renderLabels() {
    const { labels } = this.props;
    return _.map(labels, (label) => {
      return (
        <span key={label} styleName="label">
          {label}
        </span>
      );
    });
  }

  render() {
    const { categories } = this.props;

    return (
      <div styleName="container">
        {_.map(categories, (category) => {
          return (
            <div key={category} styleName="category-container">
              {category !== SURVEY_TEXTS.OTHER_TEXT_INPUT && (
                <span styleName="category-title">{category}</span>
              )}
              <div styleName="rank-container">
                {this.renderCategoryRankChoices(category)}
              </div>
              {category !== SURVEY_TEXTS.OTHER_TEXT_INPUT && (
                <div styleName="label-container">{this.renderLabels()}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default CategoryRankChoices;
