import React, {useContext} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import EditDefault from '../../../shared/library/icons/edit.svg';
import {RouteContext} from '../../../shared/enhancers/router-enhancer';
import {PHONE} from '../../../shared/style/breakpoints';

const Container = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: 5,
  marginBottom: -10
});

const Tag = glamorous.div({
  border: '1px solid #e1e1e1',
  borderRadius: 11.5,
  padding: '5px 15px',
  fontSize: 12,
  lineHeight: 1.17,
  color: '#707070',
  marginRight: 10,
  marginBottom: 10,
  minHeight: 24,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ' span': {
    wordBreak: 'break-all'
  }
});

const EditDiv = glamorous.div(({hideText}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 3,
  background: '#fafafa',
  cursor: 'pointer',
  fontSize: 10,
  lineHeight: 1.17,
  position: 'relative',
  padding: 9,
  maxHeight: 26,
  '> div': {
    position: 'absolute',
    left: 20,
    width: 'max-content',
    background: '#fafafa',
    color: '#707070',
    height: 26,
    borderRadius: 3,
    alignItems: 'center',
    paddingRight: 9,
    paddingLeft: 5,
    display: hideText ? 'none' : 'flex'
  },
  ':hover': {
    backgroundColor: '#e7e7e7',
    '> div': {
      backgroundColor: '#e7e7e7',
      display: 'flex'
    }
  },
  [PHONE]: {
    display: 'none'
  }
}));

const Edit = glamorous(EditDefault)({
  height: 8,
  width: 8
});

const AllTags = ({tags, setEditMode}) => {
  const {ownerSlug} = useContext(RouteContext);

  return (
    <Container>
      {tags.map((t, index) => (
        <Tag key={index} onClick={() => window.open(`/companies/${ownerSlug}/tags/${t}`, '_self')}>
          <span>{t}</span>
        </Tag>
      ))}
      <EditDiv onClick={() => setEditMode(true)} hideText={tags.length !== 0}>
        <Edit />
        <div>{tags.length === 0 ? 'Add Tags' : 'Edit Tags'}</div>
      </EditDiv>
    </Container>
  );
};

AllTags.propTypes = {
  tags: PropTypes.array,
  setEditMode: PropTypes.func
};

export default AllTags;
