'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, List } from 'immutable';
import debounce from 'transmute/debounce';
import identity from 'transmute/identity';
import { USED_SUGGESTIONS, USED_ALL_SUGGESTIONS, VIEWED_SUGGESTIONS } from 'draft-smart-detections/tracking/Actions';
import { MIN_BODY_CHARACTER_COUNT } from './rules/lib/suggestionConstants';
var DEFAULT_LIST_SIZE = 1;

var getBlockMap = function getBlockMap(editorState) {
  return editorState.getCurrentContent().getBlockMap();
};

export default (function (_ref) {
  var bodySuggestions = _ref.bodySuggestions,
      subjectSuggestions = _ref.subjectSuggestions,
      combinedSuggestions = _ref.combinedSuggestions,
      _ref$onUseSuggestions = _ref.onUseSuggestions,
      onUseSuggestions = _ref$onUseSuggestions === void 0 ? identity : _ref$onUseSuggestions;
  return function (Component) {
    return createReactClass({
      propTypes: {
        bodyState: PropTypes.object.isRequired,
        subjectState: PropTypes.object.isRequired,
        setUsedSuggestion: PropTypes.func,
        setUsedAllSuggestions: PropTypes.func,
        tracker: PropTypes.func.isRequired
      },
      getDefaultProps: function getDefaultProps() {
        return {
          isNew: true,
          tracker: identity
        };
      },
      getInitialState: function getInitialState() {
        var _this$props = this.props,
            bodyState = _this$props.bodyState,
            subjectState = _this$props.subjectState;
        this.debouncedBodyState = debounce(300, this.handleBodyStateChange);
        this.debouncedSubjectState = debounce(300, this.handleSubjectStateChange);
        this.debounceFinishCheckingContent = debounce(1500, this.handleFinishCheckingContent);
        this.subjectSuggestions = subjectSuggestions && subjectSuggestions(this.getDepCache, this.setDepCache);
        this.bodySuggestions = bodySuggestions && bodySuggestions(this.getDepCache, this.setDepCache);
        this.combinedSuggestions = combinedSuggestions && combinedSuggestions(this.getDepCache, this.setDepCache);
        return {
          bodyState: bodyState,
          subjectState: subjectState,
          subjectSuggestionsList: this.getSuggestionsList(this.subjectSuggestions, bodyState, subjectState),
          bodySuggestionsList: this.getSuggestionsList(this.bodySuggestions, bodyState, subjectState),
          combinedSuggestionsList: this.getSuggestionsList(this.combinedSuggestions, bodyState, subjectState),
          isCheckingContent: false,
          previousSuggestionsSize: null,
          depCache: ImmutableMap()
        };
      },
      UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
        var _this$state = this.state,
            bodyState = _this$state.bodyState,
            subjectState = _this$state.subjectState;
        var nextBodyState = nextProps.bodyState;
        var nextSubjectState = nextProps.subjectState;
        var currentBodyStateBlockMap = getBlockMap(bodyState);
        var currentSubjectStateBlockMap = getBlockMap(subjectState);
        var nextBodyStateBlockMap = getBlockMap(nextBodyState);
        var nextSubjectStateBlockMap = getBlockMap(nextSubjectState);

        if (!currentBodyStateBlockMap.equals(nextBodyStateBlockMap)) {
          this.debouncedBodyState(nextBodyState, nextSubjectState);
          this.debounceFinishCheckingContent();
        }

        if (!currentSubjectStateBlockMap.equals(nextSubjectStateBlockMap)) {
          this.debouncedSubjectState(nextSubjectState);
          this.debounceFinishCheckingContent();
        }
      },
      checkIfUserUsedSuggestions: function checkIfUserUsedSuggestions() {
        var _this$props2 = this.props,
            setUsedSuggestion = _this$props2.setUsedSuggestion,
            setUsedAllSuggestions = _this$props2.setUsedAllSuggestions,
            tracker = _this$props2.tracker;
        var previousSuggestionsSize = this.state.previousSuggestionsSize;

        if (previousSuggestionsSize !== null) {
          var currentSuggestionsSize = this.getSuggestionsSize();

          if (currentSuggestionsSize < previousSuggestionsSize) {
            tracker(USED_SUGGESTIONS);
            onUseSuggestions({
              all: false
            });

            if (setUsedSuggestion) {
              setUsedSuggestion();
            }
          }

          if (currentSuggestionsSize === 0 && previousSuggestionsSize !== 0) {
            tracker(USED_ALL_SUGGESTIONS);
            onUseSuggestions({
              all: true
            });

            if (setUsedAllSuggestions) {
              setUsedAllSuggestions();
            }
          }

          this.setState({
            previousSuggestionsSize: currentSuggestionsSize
          });
        }
      },
      setDepCache: function setDepCache(depCache) {
        var _this = this;

        var _this$state2 = this.state,
            bodyState = _this$state2.bodyState,
            subjectState = _this$state2.subjectState;
        this.setState({
          depCache: depCache
        }, function () {
          _this.debouncedBodyState(bodyState, subjectState);

          _this.debouncedSubjectState(subjectState);

          _this.debounceFinishCheckingContent();
        });
      },
      getDepCache: function getDepCache() {
        return this.state ? this.state.depCache : ImmutableMap();
      },
      isTemplateReadyToCheck: function isTemplateReadyToCheck(bodyState) {
        var currentContentState = bodyState.getCurrentContent();
        var plainText = currentContentState.getPlainText();
        return plainText.length > MIN_BODY_CHARACTER_COUNT;
      },
      handleDotClick: function handleDotClick(isOpen) {
        var tracker = this.props.tracker;
        var previousSuggestionsSize = this.state.previousSuggestionsSize;

        if (isOpen) {
          tracker(VIEWED_SUGGESTIONS);
        }

        if (previousSuggestionsSize === null) {
          this.setState({
            previousSuggestionsSize: this.getSuggestionsSize()
          });
        }
      },
      handleFinishCheckingContent: function handleFinishCheckingContent() {
        this.checkIfUserUsedSuggestions();
        this.setState({
          isCheckingContent: false
        });
      },
      handleBodyStateChange: function handleBodyStateChange(bodyState, subjectState) {
        var isCheckingContent = this.isTemplateReadyToCheck(bodyState);

        if (isCheckingContent) {
          this.debounceFinishCheckingContent();
        }

        var subjectSuggestionsList = this.getSuggestionsList(this.subjectSuggestions, bodyState, subjectState);
        var bodySuggestionsList = this.getSuggestionsList(this.bodySuggestions, bodyState, subjectState);
        var combinedSuggestionsList = this.getSuggestionsList(this.combinedSuggestions, bodyState, subjectState);
        this.setState({
          bodyState: bodyState,
          bodySuggestionsList: bodySuggestionsList,
          subjectSuggestionsList: subjectSuggestionsList,
          combinedSuggestionsList: combinedSuggestionsList,
          isCheckingContent: isCheckingContent
        });
      },
      handleSubjectStateChange: function handleSubjectStateChange(subjectState) {
        var bodyState = this.state.bodyState;
        var isCheckingContent = this.isTemplateReadyToCheck(bodyState);

        if (isCheckingContent) {
          this.debounceFinishCheckingContent();
        }

        var subjectSuggestionsList = this.getSuggestionsList(this.subjectSuggestions, bodyState, subjectState);
        var combinedSuggestionsList = this.getSuggestionsList(this.combinedSuggestions, bodyState, subjectState);
        this.setState({
          subjectState: subjectState,
          subjectSuggestionsList: subjectSuggestionsList,
          combinedSuggestionsList: combinedSuggestionsList,
          isCheckingContent: isCheckingContent
        });
      },
      getSuggestionsList: function getSuggestionsList(suggestionsFn, bodyState, subjectState) {
        return suggestionsFn ? suggestionsFn(bodyState, subjectState) : List();
      },
      getAllSuggestions: function getAllSuggestions() {
        var _this$state3 = this.state,
            bodySuggestionsList = _this$state3.bodySuggestionsList,
            subjectSuggestionsList = _this$state3.subjectSuggestionsList,
            combinedSuggestionsList = _this$state3.combinedSuggestionsList;
        return bodySuggestionsList.concat(subjectSuggestionsList).concat(combinedSuggestionsList).sort(function (suggestionA, suggestionB) {
          return suggestionB.get('degree') - suggestionA.get('degree');
        });
      },
      getSuggestionsSize: function getSuggestionsSize() {
        var _this$state4 = this.state,
            bodySuggestionsList = _this$state4.bodySuggestionsList,
            subjectSuggestionsList = _this$state4.subjectSuggestionsList,
            combinedSuggestionsList = _this$state4.combinedSuggestionsList;
        return bodySuggestionsList.concat(subjectSuggestionsList).concat(combinedSuggestionsList).size - DEFAULT_LIST_SIZE;
      },
      render: function render() {
        var _this$state5 = this.state,
            bodyState = _this$state5.bodyState,
            isCheckingContent = _this$state5.isCheckingContent,
            subjectSuggestionsList = _this$state5.subjectSuggestionsList,
            bodySuggestionsList = _this$state5.bodySuggestionsList,
            combinedSuggestionsList = _this$state5.combinedSuggestionsList;
        var isTemplateReadyToCheck = this.isTemplateReadyToCheck(bodyState);
        var hideSuggestions = !isTemplateReadyToCheck || subjectSuggestionsList === null || bodySuggestionsList === null || combinedSuggestionsList === null;

        if (hideSuggestions) {
          return null;
        }

        var suggestions = this.getAllSuggestions();
        var size = this.getSuggestionsSize();
        return /*#__PURE__*/_jsx(Component, {
          suggestions: suggestions,
          isCheckingContent: isCheckingContent,
          size: size,
          handleDotClick: this.handleDotClick
        });
      }
    });
  };
});