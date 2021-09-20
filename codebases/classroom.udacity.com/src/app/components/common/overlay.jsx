import $ from 'jquery';
import { IconClose } from '@udacity/veritas-icons';
import { Portal } from 'react-overlays';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './overlay.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'common/overlay';

    static propTypes = {
      onHide: PropTypes.func.isRequired,
      onClick: PropTypes.func,
      lightBackground: PropTypes.bool,
      fullScreen: PropTypes.bool,
    };

    static defaultProps = {
      onClick: _.noop,
      lightBackground: false,
      fullScreen: false,
    };

    componentDidMount() {
      $(document).on('keydown', this.handleKeydown);
      $('body').addClass('noscroll');
      $('#app').addClass('blur');
    }

    componentWillUnmount() {
      $(document).off('keydown', this.handleKeydown);
      $('body').removeClass('noscroll');
      $('#app').removeClass('blur');
    }

    handleCloseClick = (evt) => {
      evt.preventDefault();
      this.props.onHide();
    };

    handleCloseClickOnEnter = (e) => {
      if (e.key === 'Enter') {
        this.handleCloseClick(e);
      }
    };

    handleKeydown = (evt) => {
      if (evt.which === 27) {
        // esc pressed
        evt.stopPropagation();
        this.props.onHide();
      }
    };

    render() {
      var { lightBackground, fullScreen } = this.props;

      return (
        <Portal onKeyDown={this.handleKeydown} container={$('body').get(0)}>
          <div
            styleName={lightBackground ? 'overlay-light' : 'overlay'}
            aria-modal="true"
            role="dialog"
          >
            <div
              role="button"
              tabIndex="0"
              styleName="dismiss"
              onClick={this.handleCloseClick}
              onKeyPress={this.handleCloseClickOnEnter}
              ref="close"
            >
              <IconClose size="lg" text={__('Close')} />
            </div>

            <div styleName={fullScreen ? 'content-full' : 'content'}>
              {this.props.children}
            </div>

            <div
              role="button"
              tabIndex="0"
              onClick={this.handleCloseClick}
              onKeyPress={this.handleCloseClickOnEnter}
              styleName="overlay-dismiss"
            >
              {__('Close')}
            </div>
          </div>
        </Portal>
      );
    }
  },
  styles,
  { errorWhenNotFound: false }
);
