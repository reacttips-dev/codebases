import React, {useState, useEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT, WEIGHT} from '../../style/typography';
import {ASH, BLACK, CATHEDRAL, GUNSMOKE} from '../../style/colors';
import animate, {opacity} from '../animation/animate';
import CloseIcon from '../icons/close-circle.svg';
import {SearchResult} from './search-result';
import {clamp} from '../../utils/number';
import {SearchContext} from './providers/context';

export const MODE_INLINE = 'inline';
export const MODE_FLOATING = 'floating';

const Container = glamorous.div({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  height: '100%'
});

const InputWrapper = glamorous.div({
  position: 'relative',
  width: '100%',
  height: '100%',
  zIndex: 2
});

export const Input = glamorous.input({
  padding: 12,
  paddingRight: 40,
  ...BASE_TEXT,
  color: BLACK,
  border: `1px solid ${GUNSMOKE}`,
  borderRadius: 4,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  position: 'relative',
  WebkitAppearance: 'none',
  '&:disabled': {
    display: 'none'
  }
});

const CloseButton = glamorous.button({
  position: 'absolute',
  top: 5,
  right: 0,
  padding: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  outline: 'none'
});

const ResultsPanel = glamorous.div(
  {
    position: 'absolute',
    top: -15,
    right: -15,
    left: -15,
    height: 'auto',
    borderRadius: 7,
    boxShadow: '0 2px 13px 0 rgba(165, 165, 165, 0.5)',
    border: 'solid 1px #d8d8d8',
    background: '#ffffff',
    zIndex: 1,
    padding: 15,
    opacity: 0,
    display: 'none'
  },
  ({mode, active}) =>
    mode === MODE_INLINE
      ? {
          top: -15,
          right: -15,
          left: -15,
          height: 'auto',
          borderRadius: 7,
          boxShadow: '0 2px 13px 0 rgba(165, 165, 165, 0.5)',
          border: 'solid 1px #d8d8d8',
          padding: 15,
          display: active ? 'block' : 'none'
        }
      : {
          top: 57,
          right: 0,
          left: 0,
          height: 'auto',
          borderRadius: 2,
          boxShadow: '0 6px 7px 0 rgba(171, 171, 171, 0.24)',
          border: 'solid 1px #cacaca',
          padding: 0,
          display: active ? 'block' : 'none'
        }
);

const Results = glamorous.ul(
  {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  ({mode}) => ({
    marginTop: mode === MODE_INLINE ? 42 : 0,
    '> li:first-child': {
      marginTop: mode === MODE_INLINE ? 50 : 0
    }
  })
);

const TypeLabel = glamorous.span({
  ...BASE_TEXT,
  fontSize: 9,
  lineHeight: 1,
  fontWeight: WEIGHT.BOLD,
  textTransform: 'uppercase',
  background: ASH,
  borderRadius: 2,
  padding: '3px 5px',
  color: CATHEDRAL,
  letterSpacing: 0.5,
  marginRight: 5
});

const Result = glamorous.p({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    overflow: 'visible',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    height: 'auto'
  }
});

export const renderCloseButton = onClick => (
  <CloseButton className="CloseButton" onClick={onClick}>
    <CloseIcon />
  </CloseButton>
);

const SearchInput = ({
  placeholder,
  onChange,
  onActive,
  mode = MODE_INLINE,
  focus = false,
  showTypeLabels = false,
  filterResults = () => true,
  disabled
}) => {
  const [keyword, setKeyword] = useState('');
  const resultsPanel = useRef(null);
  const searchInput = useRef(null);
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const index = useRef(highlightedIndex);
  index.current = highlightedIndex;

  const handleChange = result => {
    onChange(result);
    setActive(false);
    setKeyword('');
    setResults([]);
    setHighlightedIndex(0);
  };

  const handleKeyDown = event => {
    const currentIndex = index.current;

    switch (event.keyCode) {
      case 40: // Down
        event.preventDefault();
        setHighlightedIndex(
          currentIndex === null ? 0 : clamp(0, results.length - 1, currentIndex + 1)
        );
        break;
      case 38: // Up
        event.preventDefault();
        setHighlightedIndex(
          currentIndex === null
            ? results.length - 1
            : clamp(0, results.length - 1, currentIndex - 1)
        );
        break;
      case 13: // Enter
        event.preventDefault();
        handleChange(results[Number(currentIndex)]);
    }
  };

  const searchProvider = useContext(SearchContext);
  useEffect(() => {
    if (keyword.length > 0) {
      searchProvider(keyword).then(results => setResults(results.filter(filterResults)));
    } else {
      setResults([]);
    }
  }, [keyword]);

  useEffect(() => {
    if (results.length > 0) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results]);

  useEffect(() => {
    setHighlightedIndex(null);

    if (resultsPanel.current) {
      if (!active && keyword.length > 0 && results.length !== 0) {
        onActive && onActive(true);
        setActive(true);
        animate([{element: resultsPanel.current, from: 0, to: 1}], 300, opacity);
      } else if (
        active &&
        (keyword.length === 0 || (mode === MODE_FLOATING && results.length === 0))
      ) {
        onActive && onActive(false);
        setActive(false);
      }
    }
  }, [keyword, results, active]);

  const [focusCnt, setFocus] = useState(0);
  useEffect(() => {
    if (searchInput.current && focusCnt > 0) {
      searchInput.current.focus();
    }
  }, [focusCnt]);

  useEffect(() => {
    if (focus && searchInput.current) {
      searchInput.current.focus();
    }
  }, [searchInput.current]);

  return (
    <Container>
      <InputWrapper>
        <Input
          data-testid="searchForTool"
          disabled={disabled}
          innerRef={searchInput}
          placeholder={placeholder}
          value={keyword}
          onChange={({target: {value}}) => setKeyword(value)}
          className={['SearchInput', active ? 'active' : undefined].join(' ')}
        />
        {keyword.length > 0 &&
          renderCloseButton(() => {
            setKeyword('');
            setResults([]);
            setFocus(focusCnt + 1);
          })}
      </InputWrapper>
      <ResultsPanel className="ResultsPanel" innerRef={resultsPanel} mode={mode} active={active}>
        <Results mode={mode}>
          {results.map((res, index) => (
            <SearchResult
              key={res.id}
              onClick={() => handleChange(res)}
              isHighlightedResult={index === highlightedIndex}
            >
              {showTypeLabels && <TypeLabel>{res.type}</TypeLabel>}
              {res.imageUrl && <img alt={res.name} src={res.imageUrl} />}{' '}
              <Result>{res.name}</Result>
            </SearchResult>
          ))}
        </Results>
      </ResultsPanel>
    </Container>
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onActive: PropTypes.func,
  mode: PropTypes.oneOf([MODE_INLINE, MODE_FLOATING]),
  focus: PropTypes.bool,
  showTypeLabels: PropTypes.bool,
  filterResults: PropTypes.func,
  disabled: PropTypes.bool
};

export default SearchInput;
