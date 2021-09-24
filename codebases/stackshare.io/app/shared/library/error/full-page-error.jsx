import React, {useContext} from 'react';
import glamorous from 'glamorous';
import BigTitle from '../../../shared/library/typography/big-title';
import Text from '../../../shared/library/typography/text';
import {CurrentUserContext} from '../../enhancers/current-user-enhancer';
import {ERROR_RED} from '../../style/colors';
import Error from '../../library/icons/error-2.svg';
import SimpleButton from '../../../shared/library/buttons/base/simple';
import PropTypes from 'prop-types';

const Container = glamorous.div({
  margin: '10px auto',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh'
});

const Title = glamorous(BigTitle)({
  fontSize: 50
});

const ErrorIcon = glamorous(Error)({
  height: 250,
  width: 250,
  marginBottom: 25
});

const StyledText = glamorous(Text)({
  fontSize: 20,
  display: 'block'
});

const Button = glamorous(SimpleButton)({
  fontSize: 20,
  height: 40,
  padding: '0 40px',
  margin: '50px auto 0 auto',
  width: 200
}).withComponent('a');

const AdminText = glamorous(Text)({
  fontSize: 15,
  display: 'block',
  color: ERROR_RED,
  marginBottom: 15
});

const AdminContainer = glamorous.div({
  marginTop: 30
});

const FullPageError = ({state}) => {
  const currentUser = useContext(CurrentUserContext);
  return (
    <Container>
      <div>
        <ErrorIcon />
        <Title>Sorry!</Title>
        <StyledText>Uh Oh! Looks like Something went wrong on our end!</StyledText>
        <StyledText>Our developers have been notified.</StyledText>
        <Button href="#" onClick={() => history.go(-1)}>
          Back
        </Button>
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
      </div>
    </Container>
  );
};

FullPageError.propTypes = {
  state: PropTypes.object
};

export default FullPageError;
