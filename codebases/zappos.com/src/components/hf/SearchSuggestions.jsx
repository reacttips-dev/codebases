import { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { termEncoder } from 'helpers/SearchUtils';
import { stripSpecialCharsConsolidateWhitespace } from 'helpers';
import { track } from 'apis/amethyst';
import { evExplicitSearch } from 'events/headerFooter';

import css from 'styles/components/hf/searchSuggestions.scss';

const strip = term => termEncoder(stripSpecialCharsConsolidateWhitespace(term));

export class SearchSuggestions extends Component {
  handleClick = term => {
    track(() => ([evExplicitSearch, { term, autosuggestionShown: true, autosuggestionClicked: true }]));
  };

  makeSuggestion = (item, index) => {
    const { handleClick } = this;
    const { testId } = this.context;
    const { suggestionIndex } = this.props;
    const isCurrentSelection = suggestionIndex === index;
    const className = cn({ [css.active]: isCurrentSelection });
    const id = isCurrentSelection ? 'headerSearchSuggest' : null;
    const testIdStr = testId(`searchSuggestionItem-${index}`);

    const baseProps = {
      id,
      'role': 'option',
      'aria-selected': `${isCurrentSelection}`
    };

    // String, sent when categories=false in our GET call
    if (typeof item === 'string') {
      const term = strip(item);
      return (
        <li {...baseProps} key={`categoryFalse-${term}`} className={className}>
          <a data-test-id={testIdStr} onClick={() => handleClick(item)} href={`/search/${term}`}>{item}</a>
        </li>
      );
    }

    // Obj, category present
    // We only show category for the first item if present,
    // otherwise present like the others
    const { suggestion, categories } = item;
    if (suggestion && categories && categories.length && index === 0) {
      const term = strip(suggestion);
      const category = categories[0]; // always grab first one
      return (
        <li {...baseProps} key={`category-${term}`} className={cn(css.categoryItem, className)}>
          <a data-test-id={testIdStr} onClick={() => handleClick(suggestion)} href={`/search/${term}/filter/zc2/%22${encodeURIComponent(category)}%22`}>
            {suggestion} in <span>{category}</span>
          </a>
        </li>
      );
    }

    // Obj, no cateogry
    if (suggestion) {
      const term = strip(suggestion);
      return (
        <li {...baseProps} key={`objNoCategory-${term}`} className={className}>
          <a data-test-id={testIdStr} onClick={() => handleClick(suggestion)} href={`/search/${term}`}>
            {suggestion}
          </a>
        </li>
      );
    }

    return null;
  };

  render() {
    const { testId } = this.context;
    const { suggestions } = this.props;
    if (!suggestions.length) {
      return null;
    }
    return (
      <div data-search-suggestions data-test-id={testId('searchSuggestions')} className={css.container}>
        <ul id="hfSearchSuggest" role="listbox">
          {suggestions.map(this.makeSuggestion)}
        </ul>
      </div>
    );
  }
}

SearchSuggestions.propTypes = {
  suggestions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired
};

SearchSuggestions.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('SearchSuggestions', SearchSuggestions);
