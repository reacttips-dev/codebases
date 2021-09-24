import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CATHEDRAL, WHITE} from '../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../style/typography';
import CloseCircle from '../icons/close-circle.svg';

const allowedTypes = ['company', 'tool', 'keyword'];

const Close = glamorous(CloseCircle)({cursor: 'pointer', display: 'flex'});

const Tag = glamorous.div({
  height: 32,
  background: WHITE,
  border: `1px dotted #989898`,
  borderRadius: 4,
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'nowrap',
  '>*': {
    marginLeft: 5
  },
  '>:last-child': {
    marginRight: 5
  }
});

const Logo = glamorous.div({
  width: 24,
  height: 24,
  minWidth: 24,
  minHeight: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid #d0d0d0`,
  borderRadius: 1,
  boxSizing: 'border-box'
});

const Name = glamorous.div({
  ...BASE_TEXT,
  fontSize: 12,
  letterSpacing: 0.17,
  color: '#2d2d2d',
  fontWeight: WEIGHT.BOLD,
  marginRight: 10
});

const Type = glamorous.div({
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
  marginRight: 0
});

const Container = glamorous.div({
  display: 'flex'
});

const SearchTerm = ({id, type, name, imageUrl, onRemove, showTypeLabels}) => {
  if (allowedTypes.includes(type)) {
    return (
      <Container>
        <Tag>
          {showTypeLabels && <Type>{type}</Type>}
          {imageUrl && (
            <Logo>
              <img alt={name} width="18" height="18" src={imageUrl} />
            </Logo>
          )}
          <Name>{name}</Name>
          <span title={`Remove ${name}`}>
            <Close onClick={() => onRemove(id)} />
          </span>
        </Tag>
      </Container>
    );
  }
};

SearchTerm.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(allowedTypes),
  id: PropTypes.string,
  onRemove: PropTypes.func
};

export default SearchTerm;
