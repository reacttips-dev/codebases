import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_auto-advance-overlay.scss';
var AUTO_ADVANCE_DELAY = 5; // seconds

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/atom-container/_auto-advance-overlay';

    static propTypes = {
      title: PropTypes.string,
      nextTitle: PropTypes.string,
      onAutoAdvance: PropTypes.func,
      onHide: PropTypes.func,
    };

    static defaultProps = {
      title: '',
      nextTitle: '',
      onAutoAdvance: _.noop,
      onHide: _.noop,
    };

    state = {
      autoAdvanceTimeLeft: AUTO_ADVANCE_DELAY,
    };

    componentDidMount() {
      this._autoAdvanceTimer = setInterval(() => {
        const autoAdvanceTimeLeft = this.state.autoAdvanceTimeLeft - 1;
        this.setState({
          autoAdvanceTimeLeft,
        });
        if (autoAdvanceTimeLeft <= 0) {
          this._autoAdvance();
        }
      }, 1000);
    }

    componentWillUnmount() {
      this._clearAutoAdvanceTimer();
    }

    _autoAdvance = () => {
      this._clearAutoAdvanceTimer();
      this.props.onAutoAdvance();
      this.props.onHide();
    };

    _clearAutoAdvanceTimer = () => {
      if (this._autoAdvanceTimer) {
        clearInterval(this._autoAdvanceTimer);
        this._autoAdvanceTimer = null;
      }
    };

    handleCancelClick = (evt) => {
      evt.preventDefault();
      this._clearAutoAdvanceTimer();
      this.props.onHide();
    };

    handleNextClick = (evt) => {
      evt.preventDefault();
      this._autoAdvance();
    };

    render() {
      const { title, nextTitle } = this.props;
      const { autoAdvanceTimeLeft } = this.state;

      return (
        <div styleName="auto-advance-overlay">
          <div>
            <h1>{title}</h1>
            {nextTitle ? (
              <p>
                {__(
                  'Up Next : <%= nextTitle %> in <%= autoAdvanceTimeLeft %>',
                  { nextTitle, autoAdvanceTimeLeft }
                )}
              </p>
            ) : null}
          </div>

          <ul>
            <li>
              <a href="#" onClick={this.handleCancelClick}>
                {__('Stay Here')}
              </a>
            </li>
            <li>
              <a href="#" onClick={this.handleNextClick} styleName="button">
                {__('Play Next')}
              </a>
            </li>
          </ul>
        </div>
      );
    }
  },
  styles
);
