import ButtonLink from 'components/common/button-link';
import PropTypes from 'prop-types';
import UdacityHelper from 'helpers/udacity-helper';
import { __ } from 'services/localization-service';

export default class EnrollButton extends React.Component {
  static displayName = 'components/enrollment-ad/_enroll-button';

  static propTypes = {
    ndKey: PropTypes.string,
    label: PropTypes.string,
    nanodegree: PropTypes.object.isRequired,
  };

  static defaultProps = {
    label: __('Enroll'),
  };

  render() {
    const { nanodegree, label, ...restProps } = this.props;

    return (
      <ButtonLink
        to={UdacityHelper.contentfulNanodegreeUrlSlug(nanodegree)}
        target="_blank"
        label={label}
        {...restProps}
      />
    );
  }
}
