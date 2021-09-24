import React, {useContext} from 'react';
import {ASH, PAGE_BACKGROUND, SILVER_ALUMINIUM, WHITE} from '../../../style/colors';
import glamorous from 'glamorous';
import {Avatar} from './user-panel';
import {CurrentUserContext} from '../../../enhancers/current-user-enhancer';
import {BASE_TEXT} from '../../../style/typography';
import PropTypes from 'prop-types';

const Container = glamorous.div({
  background: PAGE_BACKGROUND,
  padding: '10px 15px',
  display: 'flex',
  alignItems: 'center'
});

const FakeInput = glamorous.div({
  cursor: 'text',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${ASH}`,
  borderRadius: 2,
  height: 43,
  background: WHITE,
  ...BASE_TEXT,
  color: SILVER_ALUMINIUM,
  width: '100%',
  fontSize: 15,
  paddingLeft: 10,
  '>img': {
    marginRight: 10
  }
});

const ComposerMobileCTA = ({onClick}) => {
  const user = useContext(CurrentUserContext);

  if (!user || user.loading) {
    return null;
  }

  return (
    <Container>
      <FakeInput onClick={onClick}>
        <Avatar src={user.imageUrl} alt={`Avatar of ${user.displayName}`} size={28} /> Get advice or
        share a decision
      </FakeInput>
    </Container>
  );
};

ComposerMobileCTA.propTypes = {
  onClick: PropTypes.func
};

export default ComposerMobileCTA;
