import { getItem, setItem, subscribe } from './local-storage-wrapper';

import PropTypes from 'prop-types';

export default class LocalStorage extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    storageKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.any,
  };

  constructor(props) {
    super(props);
    const { storageKey, defaultValue } = props;
    const storageValue = getItem(storageKey);
    if (storageValue === undefined || storageValue === null) {
      setItem(storageKey, defaultValue);
    }
    this.state = {
      value: getItem(storageKey),
    };
  }

  componentDidMount() {
    const { storageKey } = this.props;
    this.unsubscribe = subscribe(() =>
      this.setState({
        value: getItem(storageKey),
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { storageKey } = this.props;
    return this.props.children({
      value: this.state.value,
      setValue: (value) => setItem(storageKey, value),
    });
  }
}
