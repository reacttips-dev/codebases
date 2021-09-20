import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Icon } from '@postman/aether';
import classnames from 'classnames';

import KeyMaps from '../../js/components/base/keymaps/KeyMaps';
import Badge from './Badge';

// TODO: Merge into one component
class SearchBoxInput extends Component {
  constructor (props) {
    super(props);

    this.getKeymapHandlers = this.getKeymapHandlers.bind(this);
    this.handleNextItem = this.handleNextItem.bind(this);
    this.handlePreviousItem = this.handlePreviousItem.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleEscape = this.handleEscape.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSuggestionSelect = this.handleSuggestionSelect.bind(this);
    this.handleSuggestionClose = this.handleSuggestionClose.bind(this);
    this.handleNextSuggestion = this.handleNextSuggestion.bind(this);
    this.handlePreviousSuggestion = this.handlePreviousSuggestion.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.focus = this.focus.bind(this);
    this.clear = this.clear.bind(this);
    this.getEditState = this.getEditState.bind(this);
    this.setEditState = this.setEditState.bind(this);

    this.state = {
      highlightedSuggestion: null,
      isSuggestionsOpen: false
    };
  }

  getClasses () {
    return classnames({
      'input': true,
      'input-line': this.props.inputStyle === 'line',
      'input-box': this.props.inputStyle === 'box',
      'input-huge': this.props.size === 'huge',
      'input-type-file': this.props.type === 'file',
      'is-error': !this.props.disabled && this.props.error,
      'show-focus': this.props.showFocus,
      'is-valid': this.props.isValid,
      'is-disabled': this.props.disabled,

      // isValid can be null if we don't have any validity information
      // so explicitly checking for false here
      'is-invalid': this.props.isValid === false
    }, this.props.className);
  }

  getWrapperClasses () {
    return classnames({
      'input-validation-wrapper': true,
      'is-valid': this.props.isValid,

      // isValid can be null if we don't have any validity information
      // so explicitly checking for false here
      'is-invalid': this.props.isValid === false
    });
  }

  handleChange (e, val) {
    let value;

    if (e) {
      if (this.props.type === 'file') {
        value = e.target.files;
      }
      else {
        value = e.target.value;
      }
    }
    else if (val) {
      value = val;
    }

    this.props.onChange && this.props.onChange(value);
    this.handleSuggestionOpen();
  }

  getKeymapHandlers () {
    return {
      'nextItem': pm.shortcuts.handle('nextItem', this.handleNextItem),
      'prevItem': pm.shortcuts.handle('prevItem', this.handlePreviousItem),
      'select': pm.shortcuts.handle('select', this.handleSelectItem),
      'quit': pm.shortcuts.handle('select', this.handleEscape)
    };
  }

  handleNextItem (e) {
    e.preventDefault();
    e.stopPropagation();
    this.handleNextSuggestion();
  }

  handlePreviousItem (e) {
    e.preventDefault();
    e.stopPropagation();
    this.handlePreviousSuggestion();
  }

  handleSelectItem (e) {
    e.preventDefault();
    if (this.state.isSuggestionsOpen && this.state.highlightedSuggestion) {
      this.handleSuggestionSelect();
    }
    else {
      let isModifierPressed = e.ctrlKey || e.metaKey;

      !isModifierPressed && this.props.onSubmit && this.props.onSubmit();
      !isModifierPressed && this.props.onEnter && this.props.onEnter(e);
      this.handleSuggestionClose();
    }
  }

  handleEscape (e) {
    e.preventDefault();
    this.handleSuggestionClose();
    this.props.onEscape && this.props.onEscape(e);
  }

  getActiveSuggestions () {
    let value = _.get(this.props, 'value', '');

    return _.filter(this.props.suggestions, (suggestion) => {
      let suggestionValue = suggestion.value || '';

      return _.includes(_.toLower(suggestionValue), _.toLower(value));
    });
  }

  _scrollHighlightedSuggestionIntoView () {
    const $node = findDOMNode(this);

    if (!$node) {
      return;
    }

    const $highlightedItem = $node.querySelector('.input-suggestion.is-hovered');

    if (!$highlightedItem) {
      return;
    }

    if ($highlightedItem.scrollIntoViewIfNeeded) {
      $highlightedItem.scrollIntoViewIfNeeded(false);
    }
    else {
      $highlightedItem.scrollIntoView(true);
    }
  }

  handleNextSuggestion () {
    !this.state.isSuggestionsOpen && this.handleSuggestionOpen();
    let activeSuggestions = this.getActiveSuggestions();

    if (!this.state.highlightedSuggestion) {
      this.setState({ highlightedSuggestion: _.first(activeSuggestions) }, () => {
        this._scrollHighlightedSuggestionIntoView();
      });
    }
    else {
      let currentSuggestionIndex = _.findIndex(activeSuggestions, (suggestion) => {
        return suggestion.value === this.state.highlightedSuggestion.value;
      });

      if (currentSuggestionIndex === (activeSuggestions.length - 1)) {
        currentSuggestionIndex = -1;
      }

      this.setState({ highlightedSuggestion: activeSuggestions[currentSuggestionIndex + 1] }, () => {
        this._scrollHighlightedSuggestionIntoView();
      });
    }
  }

  handlePreviousSuggestion () {
    let activeSuggestions = this.getActiveSuggestions();

    if (!this.state.highlightedSuggestion) {
      return;
    }
    else {
      let currentSuggestionIndex = _.findIndex(activeSuggestions, (suggestion) => {
        return suggestion.value === this.state.highlightedSuggestion.value;
      });

      if (currentSuggestionIndex === 0) {
        currentSuggestionIndex = activeSuggestions.length;
      }

      this.setState({ highlightedSuggestion: activeSuggestions[currentSuggestionIndex - 1] }, () => {
        this._scrollHighlightedSuggestionIntoView();
      });
    }
  }

  handleSuggestionHover (suggestion) {
    this.setState({ highlightedSuggestion: suggestion });
  }

  getSuggestionItemClasses (suggestion) {
    return classnames({
      'input-suggestion': true,
      'is-hovered': this.state.highlightedSuggestion === suggestion
    });
  }

  _renderSuggestions () {
    if (!this.state.isSuggestionsOpen) {
      return false;
    }

    let activeSuggestions = this.getActiveSuggestions();

    return (
      <div className='input-suggestions'>
        {
          activeSuggestions.map((suggestion) => {
            let suggestionLabel = suggestion.category === 'Header presets' ?
              ('Header Preset: ' + suggestion.value) : suggestion.value;

            return (
              <div
                className={this.getSuggestionItemClasses(suggestion)}
                key={suggestion.value}
                onMouseDown={this.handleSuggestionSelect}
                onMouseEnter={this.handleSuggestionHover.bind(this, suggestion)}
              >{suggestionLabel}</div>
            );
          })
        }
      </div>
    );
  }

  handleClick (e) {
    this.props.onClick && this.props.onClick(e);
  }

  handleFocus () {
    this.props.onFocus && this.props.onFocus();
  }

  handleBlur () {
    this.props.onBlur && this.props.onBlur();
    this.handleSuggestionClose();
  }

  handleContextMenu () {
    pm.mediator.trigger('contextMenu:inputActivated', this);
  }

  handleSuggestionSelect () {
    if (this.state.highlightedSuggestion) {
      let selectedValue;

      if (this.state.highlightedSuggestion.category === 'Header presets') {
        selectedValue = this.state.highlightedSuggestion;
      }
      else {
        selectedValue = this.state.highlightedSuggestion.value;
      }

      this.props.onChange && this.props.onChange(selectedValue);
      this.props.onSuggestionSelect && this.props.onSuggestionSelect(selectedValue);
    }

    this.handleSuggestionClose();
  }

  handleSuggestionOpen () {
    if (!this.props.suggestions) {
      return;
    }

    this.setState({
      isSuggestionsOpen: true,
      highlightedSuggestion: null
    });
  }

  handleSuggestionClose () {
    if (!this.props.suggestions) {
      return;
    }

    this.state.isSuggestionsOpen && this.setState({
      isSuggestionsOpen: false,
      highlightedSuggestion: null
    });
  }

  focus () {
    if (this.props.inputStyle === 'search') {
      this.refs.SearchInput && this.refs.SearchInput.focus && this.refs.SearchInput.focus();
    }

    if (this.refs.input) {
      let $input = this.refs.input;

      $input.focus && $input.focus();
      if (this.props.type === 'text' && !_.isEmpty(this.props.value)) {
        $input.selectionStart = $input.selectionEnd = this.props.value.length;
      }
    }
  }

  blur () {
    if (this.props.inputStyle === 'search') {
      this.refs.SearchInput && this.refs.SearchInput.blur && this.refs.SearchInput.blur();
    }
  }

  clear () {
    this.refs.input.value = '';
    this.forceUpdate();
  }

  /**
   * Issue:- CLIENTAPP-1937
   * This checks have been added to prevent the setState race condition on OnChange and parent setState on modal
   */
  shouldComponentUpdate (nextProps, nextState) {
    // Basic comparison check
    if (nextState === this.state && nextProps === this.props) {
      return false;
    }

    // Race check
    // If suggestions is open and no new highlight and value is the same as before, then return
    else if (nextState.isSuggestionsOpen && nextState.highlightedSuggestion === this.state.highlightedSuggestion && nextProps.value === this.props.value) {
      return false;
    }

    return true;
  }

  selectAll () {
    this.refs.input && this.refs.input.select();
  }

  handleDragStart (e) {
    e && e.stopPropagation();
  }

  // Returns the internal state of this React component
  // and the selection state of <input />
  getEditState () {
    const input = this.refs.input;

    if (!input) {
      return;
    }

    return {
      internalState: this.state, // internal state of this React component
      inputState: { // selection state of <input />
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
        selectionDirection: input.selectionDirection
      }
    };
  }

  // Sets the internal state of this React component
  // and the selection state of <input />
  setEditState (editState) {
    if (!editState) {
      return;
    }

    this.setState(editState.internalState, () => {
      const { selectionStart, selectionEnd, selectionDirection } = editState.inputState || {};

      this.refs.input && this.refs.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    });
  }

  render () {
    return <SearchInput {...this.props} ref='SearchInput' />;
  }
}

SearchBoxInput.defaultProps = {
  icon: 'icon-action-search-stroke'
};

export default class SearchInput extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isHovered: false,
      isFocused: false
    };

    this.handleEscape = this.handleEscape.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.setSelectAll = this.setSelectAll.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.inputRef = React.createRef();
  }

  focus () {
    this.setState({ isFocused: true },
      () => this.inputRef.current && this.inputRef.current.focus && this.inputRef.current.focus());
  }

  select () {
    this.inputRef.current && this.inputRef.current.select && this.inputRef.current.select();
  }

  setSelectionRange (start, end) {
    this.inputRef.current && this.inputRef.current.setSelectionRange && this.inputRef.current.setSelectionRange(start, end);
  }

  blur () {
    this.inputRef.current && this.inputRef.current.blur && this.inputRef.current.blur();
    this.setState({ isFocused: false });
  }

  getGroupClasses () {
    return classnames({
      'input-search-group': true,
      'is-searching': !_.isEmpty(this.props.query),
      'is-hovered': this.state.isHovered,
      'is-focused': this.state.isFocused,
      'is-blurred': !this.state.isFocused && this.props.hideCancelOnBlur
    }, this.props.className);
  }

  getKeymapHandlers () {
    return {
      'select': pm.shortcuts.handle('select', this.props.onEnter),
      'quit': pm.shortcuts.handle('select', this.handleEscape)
    };
  }

  handleEscape (e) {
    e && e.stopPropagation();
    e && e.preventDefault();
    this.props.onEscape && this.props.onEscape();
  }

  handleFocus () {
    this.setState({ isFocused: true });
    if (this.props.selectAllOnFocus) {
      this.setSelectAll();
    }

    this.props.onFocus && this.props.onFocus();
  }

  handleBlur () {
    this.props.onBlur && this.props.onBlur();
  }

  handleMouseOver () {
    this.setState({ isHovered: true });
  }

  handleMouseOut () {
    this.setState({ isHovered: false });
  }

  setSelectAll () {
    const { input } = this.refs;

    input.setSelectionRange(0, input.value.length);
  }

  getInputClasses () {
    return classnames(
      'input',
      'input-search',
      this.props.className
    );
  }

  handleChange (e) {
    this.props.onChange && this.props.onChange(e.target.value);
  }

  handleCancel (e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onCancel && this.props.onCancel();
    this.props.onChange && this.props.onChange('');
  }

  handleSubmit () {
    this.props.onSubmit && this.props.onSubmit();
  }

  handleClick (e) {
    this.props.onClick && this.props.onClick(e);
  }

  render () {
    const { isFocused } = this.state,
          groupClasses = this.getGroupClasses(),
          inputClasses = this.getInputClasses();

    return (
      <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeymapHandlers()}>
        <div
          className={groupClasses}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={() => {
            this.focus();
            if (!isFocused) {
              this.select();
            }
          }}
        >
          {
            !this.props.hideSearchGlass &&
            <div className='input-search-group__search-glass-wrapper'>
              <Icon name='icon-action-search-stroke' className='input-search-group__search-glass-icon pm-icon' color='content-color-secondary' />
            </div>
          }
          {isFocused && !_.isEmpty(this.props.badges) && (
            <div className='input-search-group__badge-wrapper'>
              {this.props.badges}
            </div>
          )}
          <div className={classnames('dummy-search-input', { 'should-display': !isFocused })}>
            {
              !this.props.hideSearchGlass &&
              <div className='input-search-group__search-glass-wrapper'>
                <Icon name='icon-action-search-stroke' className='input-search-group__search-glass-icon pm-icon' color='content-color-secondary' />
              </div>
            }
            <div className={classnames({ 'has-query': !_.isEmpty(this.props.query) })}>
              {this.props.query || this.props.placeholder}
            </div>
          </div>
          <div className='input-search-group__input-wrapper'>
            <input
              type='search'
              className={inputClasses}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onClick={this.handleClick}
              onKeyUp={this.props.onKeyUp}
              onKeyDown={this.props.onKeyDown}
              placeholder={this.props.placeholder}
              value={this.props.query}
              disabled={this.props.disabled}
              spellCheck={false}
              ref={this.inputRef}
              title={this.props.query}
            />
          </div>
          <div className='input-search-group__search-cancel-wrapper' onMouseDown={this.handleCancel}>
            <Icon name='icon-action-close-stroke' className='input-search-group__search-cancel-button' />
          </div>
        </div>
      </KeyMaps>
    );
  }
}

