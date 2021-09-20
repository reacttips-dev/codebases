import { Button, Modal } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './_unlink-account-modal.scss';

export default connect(
  null,
  actionsBinder('deleteSocialLogin')
)(
  cssModule(
    class extends React.Component {
      static displayName =
        'settings/setting-linked-accounts/_unlink-account-modal';

      static propTypes = {
        show: PropTypes.bool,
        onHide: PropTypes.func,
        provider: PropTypes.string.isRequired,
        onDisconnect: PropTypes.func.isRequired,
      };

      static defaultProps = {
        show: false,
        onHide: _.noop,
        provider: '',
        onDisconnect: _.noop,
      };

      handleCancelClick = () => {
        var { provider, onHide, onDisconnect } = this.props;

        return this.props
          .deleteSocialLogin(provider)
          .then(() => onHide())
          .then(() => onDisconnect());
      };

      handleModalHide = () => {
        this.props.onHide();
      };

      render() {
        var { show, provider } = this.props;

        return (
          <div styleName="unlink-container">
            <Modal
              open={show}
              onClose={this.handleModalHide}
              label={__('Unlink Account')}
              closeLabel={__('Close Modal')}
            >
              <div styleName="modal-container">
                <div styleName="header-text-ctr">{__('Unlink Account?')}</div>
                <p>
                  {__(
                    'Are you sure you want to unlink your <%= socialLoginProvider %> account?',
                    { socialLoginProvider: provider }
                  )}
                </p>

                <div styleName="btn-cancel">
                  <Button
                    variant="primary"
                    onClick={this.handleCancelClick}
                    label={__('Unlink Account')}
                    disabled={false}
                    isBusy={false}
                  />
                </div>

                <a href="#" onClick={this.handleModalHide}>
                  {__('Cancel')}
                </a>
              </div>
            </Modal>
          </div>
        );
      }
    },
    styles
  )
);
