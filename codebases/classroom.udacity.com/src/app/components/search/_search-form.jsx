import { Button, TextInput } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_search-form.scss';

const SEARCH_INPUT_ID = 'search/_search-form/input';

@cssModule(styles)
export default class SearchForm extends React.Component {
  static displayName = 'search/_search-form';
  static propTypes = {
    value: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleKeyUp = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      this.handleSearch();
    }
  };

  handleSearch = () => {
    const { value, onSearch } = this.props;
    return onSearch(value);
  };

  handleChange = (evt) => {
    const { onChange } = this.props;
    onChange(evt.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <div styleName="search-form">
        <label styleName="searchLabel" htmlFor={SEARCH_INPUT_ID}>
          {__('Search')}
        </label>
        <div styleName="text">
          <TextInput
            id={SEARCH_INPUT_ID}
            label={__('Search')}
            hiddenLabel={true}
            value={value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
          />
        </div>
        <Button
          onClick={this.handleSearch}
          variant="primary"
          label={__('Search')}
        />
      </div>
    );
  }
}
