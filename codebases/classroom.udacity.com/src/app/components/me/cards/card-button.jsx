import { Button } from '@udacity/veritas-components';
import { IconArrowRight } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import ViewCertificateButton from 'components/common/view-certificate-button';
import { __ } from 'services/localization-service';

export default class CardButton extends React.Component {
  static displayName = 'me/cards/card-button';

  static propTypes = {
    isLatest: PropTypes.bool,
    isGraduated: PropTypes.bool,
    handleClick: PropTypes.func,
    isReadyForGraduation: PropTypes.bool,
    nanodegreeKey: PropTypes.string,
    courseKey: PropTypes.string,
    partKey: PropTypes.string,
    isFooterbutton: PropTypes.bool,
  };

  static defaultProps = {
    isLatest: false,
    isGraduated: false,
    isReadyForGraduation: false,
    handleClick: _.noop,
    isFooterbutton: false,
  };

  render() {
    const {
      handleClick,
      isLatest,
      isGraduated,
      isReadyForGraduation,
      nanodegreeKey,
      courseKey,
      partKey,
      isFooterbutton,
    } = this.props;

    switch (true) {
      case isLatest && isReadyForGraduation:
        return (
          <Button
            label={__('Graduate')}
            variant="primary"
            iconRight={<IconArrowRight />}
            onClick={handleClick}
          />
        );

      case isLatest:
        return (
          <Button
            label={__('Continue')}
            variant="primary"
            iconRight={<IconArrowRight />}
            onClick={handleClick}
          />
        );

      case isGraduated: {
        // Should always have one of these
        const programKey = nanodegreeKey || courseKey || partKey;
        return isFooterbutton ? (
          <ViewCertificateButton programKey={programKey} />
        ) : (
          <Button
            label={__('Program Home')}
            variant="secondary"
            iconRight={<IconArrowRight />}
            onClick={handleClick}
          />
        );
      }

      case isReadyForGraduation:
        return (
          <Button
            label={__('Graduate')}
            variant="secondary"
            onClick={handleClick}
          />
        );

      default:
        return (
          <Button
            label={__('Program Home')}
            variant="secondary"
            iconRight={<IconArrowRight />}
            onClick={handleClick}
          />
        );
    }
  }
}
