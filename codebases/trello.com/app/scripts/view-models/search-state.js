// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');

module.exports.SearchState = new (class extends TrelloModel {
  constructor() {
    super();
    this.set({
      query: '',
      suggestions: [],
      suggestionSearchTerm: '',
      suggestSearchModelTypes: '',
    });
  }

  getQuery() {
    return this.get('query');
  }

  setQuery(query) {
    if (query !== this.getQuery()) {
      this.set('query', query);
    }

    if (query === '') {
      this.clearSuggestions();
      this.clearSuggestionSearchTerm();
      return this.clearSuggestionSearchModelTypes();
    }
  }

  removeStringFromQuery(string) {
    const query = this.getQuery();
    const re = new RegExp(`${Util.escapeForRegex(string)}`);

    // if the query contains the string, then it doesn't need to be removed
    if (re.test(query)) {
      let val = query.replace(string, '');
      val = Util.stripExtraSpaces(val);
      if (val !== '') {
        val += ' ';
      }

      return this.setQuery(val);
    }
  }

  addStringToQuery(string) {
    const query = this.getQuery();
    const re = new RegExp(`${Util.escapeForRegex(string)}`);

    // if the query doesn't contains the stirng, then we need to add it.
    // otherwise, don't do anything.
    if (!re.test(query)) {
      let val = `${query} ${string}`;
      val = Util.stripExtraSpaces(val) + ' ';

      return this.setQuery(val);
    }
  }

  getSuggestions() {
    return this.get('suggestions');
  }

  setSuggestions(matches) {
    return this.set('suggestions', matches);
  }

  clearSuggestions() {
    return this.set('suggestions', []);
  }

  getSuggestionSearchTerm() {
    return this.get('suggestionSearchTerm');
  }

  setSuggestionSearchTerm(term) {
    return this.set('suggestionSearchTerm', term);
  }

  clearSuggestionSearchTerm() {
    return this.set('suggestionSearchTerm', '');
  }

  getSuggestionSearchModelTypes() {
    return this.get('suggestSearchModelTypes');
  }

  setSuggestionSearchModelTypes(type) {
    return this.set('suggestSearchModelTypes', type);
  }

  clearSuggestionSearchModelTypes() {
    return this.set('suggestSearchModelTypes', '');
  }
})();
