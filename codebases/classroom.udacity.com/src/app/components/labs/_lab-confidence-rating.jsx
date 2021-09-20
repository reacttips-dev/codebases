import PropTypes from 'prop-types';
import Section from './_section';
import StarRating from 'components/common/star-rating';
import { __ } from 'services/localization-service';
import styles from './_shared.scss';

@cssModule(styles)
export default class LabConfidenceRating extends React.Component {
  static displayName = 'components/labs/confidence-rating';

  static propTypes = {
    evaluationObjective: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func,
    theme: StarRating.propTypes.theme,
  };

  static defaultProps = {
    onChange: _.noop,
    value: null,
    theme: Section.defaultProps.theme,
  };

  render() {
    const { evaluationObjective, value, onChange, theme } = this.props;

    return (
      <Section
        title={__(
          'How confident do you feel about your understanding and grasp of <%= evaluationObjective %>?',
          { evaluationObjective }
        )}
        theme={theme}
      >
        <StarRating theme={theme} onClick={onChange} rating={value} />
      </Section>
    );
  }
}
