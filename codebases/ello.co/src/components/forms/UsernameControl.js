import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FormControl from './FormControl'

class UsernameControl extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    suggestions: PropTypes.object,
  }

  static defaultProps = {
    className: 'UsernameControl',
    id: 'username',
    label: 'Username',
    name: 'user[username]',
    placeholder: 'Enter your username',
  }

  onClickUsernameSuggestion = (e) => {
    const val = e.target.title
    const element = document.getElementById('username')
    if (element) {
      element.value = val
    }
  }

  renderSuggestions = () => {
    const { suggestions } = this.props
    if (suggestions && suggestions.size) {
      return (
        <ul className="FormControlSuggestionList hasSuggestions">
          <p>Here are some available usernames &mdash;</p>
          {suggestions.map(suggestion =>
            (<li key={`suggestion_${suggestion}`}>
              <button
                className="FormControlSuggestionButton"
                title={suggestion}
                onClick={this.onClickUsernameSuggestion}
              >
                {suggestion}
              </button>
            </li>),
            )}
        </ul>
      )
    }
    return (
      <p className="FormControlSuggestionList">
        <span />
      </p>
    )
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="50"
        renderFeedback={this.renderSuggestions}
        trimWhitespace
        type="text"
      />
    )
  }
}

export default UsernameControl

