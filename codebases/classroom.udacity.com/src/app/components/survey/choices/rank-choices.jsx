import { Button } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import styles from './rank-choices.scss';

@cssModule(styles, { allowMultiple: true })
export class RankChoices extends React.Component {
  static displayName = 'survey/choices/rank-choices';

  static propTypes = {
    range: PropTypes.number.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onResponseSelected: PropTypes.func,
    response: PropTypes.object,
  };

  handleRankSelected = (value) => {
    this.props.onResponseSelected(value);
  };

  renderRankChoices() {
    const { range, response } = this.props;
    return _.map(_.times(range), (idx) => {
      const value = (idx + 1).toString();
      return (
        <Button
          key={`choice-${idx}`}
          variant={response === value ? 'primary' : 'secondary'}
          small
          label={value}
          onClick={() => this.handleRankSelected(value)}
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
    const {
      labels: [notLikely, mostLikely],
    } = this.props;

    return (
      <div styleName="container">
        <div styleName="mobile-label">
          <span styleName="label">{notLikely}</span>
        </div>
        <div styleName="rank-container">{this.renderRankChoices()}</div>
        <div styleName="mobile-label">
          <span styleName="label">{mostLikely}</span>
        </div>
        <div styleName="label-container">{this.renderLabels()}</div>
      </div>
    );
  }
}

export default RankChoices;
