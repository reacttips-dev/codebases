import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import SearchInput from '../../../search/search-input';
import {WEIGHT} from '../../../../style/typography';
import {FOCUS_BLUE, WHITE, GUNSMOKE, CONCRETE, ERROR_RED} from '../../../../style/colors';
import {SearchResult} from '../../../search/search-result';
import CloseIcon from '../../../icons/close-circle.svg';
import UnCheckedIcon from '../../../icons/unchecked.svg';
import CheckedIcon from '../../../icons/checked.svg';
import {truncateText} from '../../../../utils/truncate-text';
import {STRUCTURE_GIVE_ADVICE, TOOL_LIST_DEFAULT} from '../../constants';
import {
  COMPOSER_TOOL_ADD,
  COMPOSER_TOOL_CHOOSE,
  COMPOSER_TOOL_REMOVE,
  COMPOSER_TOOL_UNSELECT
} from '../../state/actions';
import {DispatchContext, StateContext} from '../../state/provider';
import {ToolListType} from '../../types';
import ToolSearchProvider from '../../../search/providers/tool';

const WIDTH = 165;
const WIDTH_NARROW = 176;
const PADDING = 9;

const Container = glamorous.div({
  marginTop: 4,
  marginBottom: 4,
  marginRight: 10,
  width: WIDTH + 2 * PADDING + 2,
  '.composer-narrow &': {
    width: WIDTH_NARROW + 2 * PADDING + 2
  }
});

const Placeholder = glamorous.div(
  {
    display: 'inline-block',
    borderRadius: 4,
    padding: `12px ${PADDING}px`,
    cursor: 'pointer',
    boxSizing: 'content-box',
    ':hover': {
      borderColor: GUNSMOKE
    },
    width: WIDTH,
    '.composer-narrow &': {
      width: WIDTH_NARROW
    }
  },
  ({hasError}) => ({
    border: hasError ? `1px dotted ${ERROR_RED}` : `1px dotted ${FOCUS_BLUE}`,
    color: hasError ? ERROR_RED : FOCUS_BLUE
  })
);

const Tool = glamorous(SearchResult)(
  {
    width: WIDTH,
    '.composer-narrow &': {
      width: WIDTH_NARROW
    },
    boxSizing: 'content-box',
    borderRadius: 4,
    border: `1px dotted ${CONCRETE}`,
    fontWeight: WEIGHT.BOLD,
    padding: `11px ${PADDING}px`,
    ':hover': {
      background: WHITE,
      borderColor: GUNSMOKE
    },
    '> svg': {
      marginLeft: 'auto',
      cursor: 'pointer'
    }
  },
  ({choice}) => ({
    borderStyle: choice ? 'solid' : 'dotted',
    cursor: choice ? 'pointer' : 'default'
  })
).withComponent('div');

const IconGroup = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  ' > svg:last-of-type': {
    marginLeft: 10,
    cursor: 'pointer'
  }
});

const ToolTagger = ({
  tool,
  listType,
  filterResults = () => true,
  placeholder,
  hasError,
  isPrivate
}) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isActive, setIsActive] = useState(false);
  const container = useRef();

  const isChoice =
    state.selectedStructure === STRUCTURE_GIVE_ADVICE && listType === TOOL_LIST_DEFAULT;

  const handleFocus = () => {
    document.addEventListener('click', handleBlur, {capture: true});
    setIsActive(true);
  };

  const handleBlur = event => {
    if (container.current && !container.current.contains(event.target)) {
      setIsActive(false);
      document.removeEventListener('click', handleBlur, {capture: true});
    }
  };

  return (
    <ToolSearchProvider>
      <Container innerRef={container}>
        {tool ? (
          <Tool
            choice={isChoice}
            onClick={() =>
              isChoice && tool.chosen
                ? dispatch({type: COMPOSER_TOOL_UNSELECT, tool, listType, isPrivate})
                : dispatch({type: COMPOSER_TOOL_CHOOSE, tool, listType, isPrivate})
            }
          >
            <img alt={tool.name} src={tool.imageUrl} />
            <span title={tool.name}>{truncateText(tool.name, 8, '...', true)}</span>
            {isChoice ? (
              tool.chosen ? (
                <IconGroup>
                  <CheckedIcon
                    onClick={() => {
                      setIsActive(false);
                      dispatch({type: COMPOSER_TOOL_UNSELECT, tool, listType, isPrivate});
                    }}
                  />
                </IconGroup>
              ) : (
                <UnCheckedIcon />
              )
            ) : state.selectedStructure === STRUCTURE_GIVE_ADVICE ? (
              <IconGroup>
                <CheckedIcon
                  onClick={() => {
                    setIsActive(false);
                    dispatch({type: COMPOSER_TOOL_UNSELECT, tool, listType, isPrivate});
                  }}
                />
              </IconGroup>
            ) : (
              <CloseIcon
                onClick={event => {
                  event.stopPropagation();
                  setIsActive(false);
                  dispatch({type: COMPOSER_TOOL_REMOVE, tool, listType, isPrivate});
                }}
              />
            )}
          </Tool>
        ) : isActive ? (
          <SearchInput
            placeholder="Search..."
            onChange={({_result}) => {
              setIsActive(false);
              dispatch({type: COMPOSER_TOOL_ADD, tool: _result, listType, isPrivate});
            }}
            focus={true}
            filterResults={filterResults}
          />
        ) : (
          <Placeholder onClick={handleFocus} hasError={hasError}>
            {placeholder}
          </Placeholder>
        )}
      </Container>
    </ToolSearchProvider>
  );
};

ToolTagger.propTypes = {
  tool: PropTypes.object,
  listType: ToolListType.isRequired,
  filterResults: PropTypes.func,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
  isPrivate: PropTypes.bool
};

export default ToolTagger;
