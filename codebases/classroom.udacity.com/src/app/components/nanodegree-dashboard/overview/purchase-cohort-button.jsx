import EnrollButtonContainer from 'components/enrollment-ad/_enroll-button-container';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';

export class PurchaseCohortButton extends React.Component {
  static displayName =
    'components/nanodegree-dashboard/overview/purchase-cohort-button';

  static propTypes = {
    ndKey: PropTypes.string.isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: __('Enroll'),
  };

  render() {
    const { ndKey, ...restProps } = this.props;

    return (
      <EnrollButtonContainer ndKey={ndKey} target="_blank" {...restProps} />
    );
  }
}

export default PurchaseCohortButton;
