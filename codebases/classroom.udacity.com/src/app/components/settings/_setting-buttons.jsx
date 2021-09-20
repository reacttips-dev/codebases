import BusyButton from 'components/common/busy-button';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_setting-buttons.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/setting-buttons';

    static propTypes = {
      onSaveClick: PropTypes.func,
      onCancelClick: PropTypes.func,
      isSaveEnabled: PropTypes.bool,
    };

    static defaultProps = {
      onSaveClick: _.noop,
      onCancelClick: _.noop,
      isSaveEnabled: true,
    };

    render() {
      var { onCancelClick, onSaveClick, isSaveEnabled } = this.props;

      return (
        <div styleName="buttons-container">
          <BusyButton
            onClick={onCancelClick}
            variant="secondary"
            label={__('cancel')}
          />
          <BusyButton
            onClick={onSaveClick}
            variant="primary"
            disabled={!isSaveEnabled}
            label={__('save')}
          />
        </div>
      );
    }
  },
  styles
);
