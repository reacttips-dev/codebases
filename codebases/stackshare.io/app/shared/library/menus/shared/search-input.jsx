import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import CloseMenu from '../../icons/close-menu.svg';
import {BASE_TEXT} from '../../../style/typography';
import {ASH, BLACK} from '../../../style/colors';
import SiteSearch from '../../search/site/site-search';

const Container = glamorous.div({
  position: 'relative',
  flex: 1,
  display: 'flex'
});

const Input = glamorous.input(
  {
    ...BASE_TEXT,
    boxSizing: 'border-box',
    borderRadius: 30,
    height: 30,
    border: `1px solid ${ASH}`,
    paddingLeft: 15,
    flex: 1,
    outline: 'none',
    color: BLACK,
    WebkitAppearance: 'none'
  },
  ({inputWidth}) => (inputWidth ? {width: inputWidth} : {})
);

const CloseSearch = glamorous.div({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  right: 0,
  height: 30,
  width: 30
});

const SearchInput = forwardRef((props, ref) => {
  const {value, active, onDeactivate, onFocus, onResults, onChange, inputWidth} = props;

  return (
    <Container innerRef={ref}>
      <SiteSearch onResults={onResults}>
        {doSearch => (
          <Input
            inputWidth={inputWidth}
            placeholder="Search"
            value={value}
            onChange={({target: {value}}) => {
              onChange(value);
              doSearch(value);
            }}
            onFocus={onFocus}
          />
        )}
      </SiteSearch>
      {active && (
        <CloseSearch onClick={onDeactivate}>
          <CloseMenu width={12} height={12} />
        </CloseSearch>
      )}
    </Container>
  );
});

SearchInput.propTypes = {
  value: PropTypes.string,
  inputWidth: PropTypes.string,
  active: PropTypes.bool,
  onDeactivate: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onResults: PropTypes.func
};

export default SearchInput;
