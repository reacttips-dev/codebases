import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {FOCUS_BLUE} from '../../../style/colors';
import PlusIcon from '../../icons/plus-icon.svg';
import {BASE_TEXT} from '../../../../shared/style/typography';

const SmallPlusIconContainer = glamorous.div({
  background: FOCUS_BLUE,
  borderRadius: 50,
  width: 18,
  height: 18,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 7
});

const AddItemLink = glamorous.a({
  ...BASE_TEXT,
  marginLeft: 10,
  color: FOCUS_BLUE,
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  fontSize: 15
});

const SmallPlusIcon = glamorous(PlusIcon)({height: 10, width: 10});

const AddItem = ({addItemLink, addItemTitle}) => {
  return (
    <AddItemLink href={addItemLink} title={addItemTitle}>
      <SmallPlusIconContainer>
        <SmallPlusIcon />
      </SmallPlusIconContainer>{' '}
      {addItemTitle}
    </AddItemLink>
  );
};

AddItem.propTypes = {
  addItemTitle: PropTypes.string,
  addItemLink: PropTypes.string
};

export default AddItem;
