import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Autosuggest from 'react-autosuggest';
import Spinner from './icons/spinner.svg';
import DefaultIcon from './icons/default-icon.svg';
import {grid} from '../../../utils/grid';
import {ASH} from '../../..//style/colors';

const Container = glamorous.div(
  {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center'
  },
  ({width}) => ({width})
);

const Status = glamorous.div({
  position: 'absolute',
  right: 12,
  top: 14,
  zIndex: 1 // show on top of text field
});

const Icon = glamorous.img({
  width: grid(4),
  height: grid(4),
  marginRight: grid(1)
});

const StyledDefaultIcon = glamorous(DefaultIcon)({
  width: grid(4),
  height: grid(4),
  marginRight: grid(1)
});

const Result = glamorous.span({
  textAlign: 'left',
  borderBottom: `1px solid ${ASH}`,
  display: 'flex',
  alignItems: 'center',
  margin: '-10px -20px',
  padding: '10px 20px'
});

export default class Typeahead extends Component {
  static propTypes = {
    apiURL: PropTypes.string.isRequired,
    customParams: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    inputStyle: PropTypes.object,
    width: PropTypes.number
  };

  static defaultProps = {
    placeholder: 'Type to load suggestions',
    maxLength: 60
  };

  state = {
    value: '',
    suggestions: [],
    isLoading: false
  };

  lastRequestId = null;

  componentWillUnmount() {
    clearTimeout(this.lastRequestId);
  }

  handleChange = (event, {newValue}) => {
    this.setState({value: newValue});
  };

  buildCustomParams = () => {
    const {customParams} = this.props;
    if (!customParams) return '';
    return (
      '&' +
      Object.keys(customParams)
        .map(key => `${key}=${encodeURIComponent(customParams[key])}`)
        .join('&')
    );
  };

  handleSuggestionsFetchRequested = ({value}) => {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    if (value === '') {
      this.handleSuggestionsClearRequested();
      return;
    }

    this.lastRequestId = setTimeout(() => {
      this.setState({isLoading: true});
      const customParams = this.buildCustomParams();

      fetch(`${this.props.apiURL}?q=${value}${customParams}`)
        .then(response => {
          return response.json();
        })
        .then(suggestions => {
          this.setState({isLoading: false, suggestions});
        });
    }, 1000);
  };

  handleSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
  };

  // https://github.com/moroshko/react-autosuggest#basic-usage
  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    const {image_url, name} = suggestion;

    return (
      <Result>
        {image_url ? <Icon src={`${image_url}`} /> : <StyledDefaultIcon />}
        {name}
      </Result>
    );
  }

  render() {
    const {value} = this.state;
    const {className, name, maxLength, placeholder, inputStyle, width} = this.props;
    const {suggestions, isLoading} = this.state;
    const inputProps = {
      className,
      name,
      maxLength,
      placeholder,
      value,
      onChange: this.handleChange,
      style: inputStyle
    };

    return (
      <Container width={width}>
        <Status>{isLoading && <Spinner className="button-spinner" />}</Status>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </Container>
    );
  }
}
