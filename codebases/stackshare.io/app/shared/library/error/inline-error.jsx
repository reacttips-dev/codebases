import React, {useContext} from 'react';
import glamorous from 'glamorous';
import Text from '../../../shared/library/typography/text';
import {CurrentUserContext} from '../../enhancers/current-user-enhancer';
import {ERROR_RED} from '../../style/colors';
import Error from '../../library/icons/error-2.svg';
import PropTypes from 'prop-types';

const Container = glamorous.div({
  margin: '15px auto',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
const ErrorIcon = glamorous(Error)({
  height: 15,
  width: 15,
  marginRight: 25
});

const StyledText = glamorous(Text)({
  fontSize: 15,
  display: 'block'
});

const AdminText = glamorous(Text)({
  fontSize: 15,
  display: 'block',
  color: ERROR_RED,
  marginBottom: 0
});

const AdminContainer = glamorous.div({
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const InlineError = ({state}) => {
  const currentUser = useContext(CurrentUserContext);
  return (
    <>
      <Container>
        <ErrorIcon />
        <div>
          <StyledText>Uh Oh! Looks like Something went wrong on our end!</StyledText>
        </div>
      </Container>
      {currentUser && currentUser.amIAdmin && (
        <AdminContainer>
          <AdminText>This is debugging for admins only 👇👇👇</AdminText>
          <details style={{whiteSpace: 'pre-wrap'}}>
            {state.error && state.error.toString()}
            <br />
            {state.errorInfo.componentStack}
          </details>
        </AdminContainer>
      )}
    </>
  );
};

InlineError.propTypes = {
  state: PropTypes.object
};

export default InlineError;
