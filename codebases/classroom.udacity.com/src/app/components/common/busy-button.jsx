import { Button } from '@udacity/veritas-components';
/* A button that will auto-show a busy indicator if the onClick returns a promise */
import PropTypes from 'prop-types';

export default class extends React.Component {
  static displayName = 'common/busy-button';

  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: '',
    variant: 'primary',
    className: '',
    disabled: false,
  };

  state = {
    isBusy: false,
    _isMounted: false,
  };

  componentDidMount() {
    this.state._isMounted = true;
  }

  componentWillUnmount() {
    this.state._isMounted = false;
  }

  handleClick = (event) => {
    const { isBusy } = this.state;

    if (!isBusy) {
      const { onClick } = this.props;

      this.setState({ isBusy: true });

      Promise.all([onClick(event)]).finally(() => {
        if (this.state._isMounted) {
          this.setState({ isBusy: false });
        }
      });
    }
  };

  render() {
    const { label, small, variant, disabled } = this.props;
    const { isBusy } = this.state;

    return (
      <Button
        variant={variant}
        disabled={disabled || isBusy}
        onClick={this.handleClick}
        label={label}
        small={small}
      />
    );
  }
}
