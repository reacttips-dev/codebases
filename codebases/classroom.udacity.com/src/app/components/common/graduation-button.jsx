import PropTypes from 'prop-types';
import TrackingButton from 'components/common/tracking-button';
import { __ } from 'services/localization-service';

export default class GraduationButton extends React.Component {
  static displayName = 'common/graduation-button';

  static propTypes = {
    ndKey: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleGraduationButtonClick = () => {
    window.open(`${CONFIG.graduationUrl}/${this.props.ndKey}`, '_blank');
  };

  render() {
    return (
      <TrackingButton
        className="btn btn-primary btn-large"
        onClick={this.handleGraduationButtonClick}
        label={__('Finish and Graduate')}
        {..._.omit(this.props, 'onClick')}
      />
    );
  }
}
