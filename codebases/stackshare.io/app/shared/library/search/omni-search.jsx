import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, GUNSMOKE, WHITE} from '../../style/colors';
import SearchTerm from './search-term';
import SearchInput, {MODE_FLOATING} from './search-input';
import CloseCircle from '../icons/close-circle.svg';

const Container = glamorous.div({
  display: 'flex',
  width: '100%',
  background: WHITE
});

const FakeInput = glamorous.div({
  width: '100%',
  position: 'relative',
  border: `1px solid ${ASH}`,
  borderRadius: 2,
  paddingLeft: 10,
  paddingRight: 30,
  display: 'flex',
  flexWrap: 'wrap',
  paddingTop: 5,
  '>*': {
    marginRight: 5,
    marginBottom: 5
  }
});

const SearchWrapper = glamorous.div({
  position: 'relative',
  flexGrow: 1,
  '> div > div > input.SearchInput': {
    padding: 0,
    paddingLeft: 5,
    border: 'none',
    flexGrow: 1,
    height: 34,
    '&.active': {
      border: `1px solid ${GUNSMOKE}`,
      width: '100%',
      height: 34,
      padding: 0,
      paddingLeft: 5
    }
  },
  '> div > div > button.CloseButton': {
    top: 1,
    padding: 7
  },
  '> div > div.ResultsPanel': {
    top: 37
  }
});

const Close = glamorous(CloseCircle)({
  cursor: 'pointer',
  position: 'absolute',
  top: 13,
  right: 5
});

const OmniSearch = ({
  placeholder,
  terms,
  onRemove,
  onAdd,
  onClear,
  showTypeLabels = true,
  disabled
}) => {
  return (
    <Container>
      <FakeInput>
        {terms &&
          terms.map(({name, id, type, imageUrl}, i) => (
            <SearchTerm
              key={i + type + id}
              onRemove={onRemove}
              name={name}
              id={id}
              type={type}
              imageUrl={imageUrl}
              showTypeLabels={showTypeLabels}
            />
          ))}
        <SearchWrapper>
          <SearchInput
            disabled={disabled}
            placeholder={placeholder}
            onChange={onAdd}
            mode={MODE_FLOATING}
            showTypeLabels={showTypeLabels}
          />
        </SearchWrapper>
        {onClear && terms.length !== 0 && (
          <div onClick={() => onClear()} title="Clear Search">
            <Close />
          </div>
        )}
      </FakeInput>
    </Container>
  );
};

OmniSearch.propTypes = {
  placeholder: PropTypes.string,
  terms: PropTypes.array,
  onRemove: PropTypes.func,
  onAdd: PropTypes.func,
  onClear: PropTypes.func,
  showTypeLabels: PropTypes.bool,
  disabled: PropTypes.bool
};

export default OmniSearch;
