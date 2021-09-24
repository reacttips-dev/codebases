import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Spinner from './spinner.svg';
import glamorous from 'glamorous';
import {isObservable} from 'mobx';

const Input = glamorous.div({
  position: 'relative'
});

const Status = glamorous.div({
  position: 'absolute',
  right: 12,
  top: 14,
  zIndex: 1 // show on top of text field
});

export default class AutosuggestInput extends Component {
  static defaultProps = {
    placeholder: 'Type to load suggestions',
    maxLength: 60
  };

  static propTypes = {
    suggestions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // mobx observable array
    loadSuggestions: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    className: PropTypes.string,
    name: PropTypes.string,
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    onChange: PropTypes.func
  };

  state = {
    value: this.props.initialValue || ''
  };

  lastRequestId = null;

  componentWillUnmount() {
    clearTimeout(this.lastRequestId);
  }

  loadSuggestions(value) {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    if (value === '') {
      this.onSuggestionsClearRequested();
      return;
    }

    this.lastRequestId = setTimeout(() => {
      this.props.loadSuggestions(value);
    }, 1000);
  }

  onChange = (event, {newValue}) => {
    this.setState({
      value: newValue
    });
    this.props.onChange && this.props.onChange(newValue);
  };

  onSuggestionsFetchRequested = ({value}) => {
    this.loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.props.clearSuggestions();
  };

  // https://github.com/moroshko/react-autosuggest#basic-usage
  getSuggestionValue(suggestion) {
    return suggestion;
  }

  renderSuggestion(suggestion) {
    return <span>{suggestion}</span>;
  }

  render() {
    const {value} = this.state;
    const {className, name, maxLength, placeholder, suggestions, isLoading} = this.props;
    const inputProps = {
      className,
      name,
      maxLength,
      placeholder,
      value,
      onChange: this.onChange
    };

    const suggestionsArray = isObservable(suggestions) ? suggestions.toJS() : suggestions;

    return (
      <Input>
        <Status>{isLoading && <Spinner className="button-spinner" />}</Status>
        <Autosuggest
          suggestions={suggestionsArray}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </Input>
    );
  }
}
