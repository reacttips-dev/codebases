import { Loading } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_search-loading-wrapper.scss';

export const DEFAULT_DELAY = 200;

@cssModule(styles)
export default class SearchLoadingWrapper extends React.Component {
  static propTypes = {
    delay: PropTypes.number,
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    delay: DEFAULT_DELAY,
  };

  state = {
    showLoading: false,
  };

  componentDidMount() {
    this.setLoading(this.props.isLoading);
  }

  componentDidUpdate(prevProps) {
    const { isLoading } = this.props;

    if (prevProps.isLoading !== isLoading) {
      this.setLoading(isLoading);
    }
  }

  componentWillUnmount() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
  }

  setLoading(isLoading) {
    const { delay } = this.props;

    if (!isLoading && this.loadingTimer) {
      this.setState({
        showLoading: false,
      });
      clearTimeout(this.loadingTimer);
    } else if (isLoading) {
      this.loadingTimer = setTimeout(() => {
        this.setState({ showLoading: true });
      }, delay);
    }
  }

  render() {
    const { showLoading } = this.state;
    const { children, isLoading } = this.props;

    if (isLoading && showLoading) {
      return (
        <div styleName="loading">
          <Loading label={__('Loading')} />
          <h3>{__('Searching...')}</h3>
        </div>
      );
      // show the student that something is happening without flashing the spinner
    } else if (isLoading) {
      return null;
    } else {
      return <div>{children}</div>;
    }
  }
}
