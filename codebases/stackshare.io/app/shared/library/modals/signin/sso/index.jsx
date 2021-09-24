import React, {useContext, useState} from 'react';
import {withApollo} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import BackIcon from '../../../icons/back-arrow-icon.svg';
import SSOIcon from '../../../icons/sso-icon-blue.svg';
import {BASE_TEXT} from '../../../../style/typography';
import BigTitle from '../../../typography/big-title';
import TextInput from '../../../inputs/text';
import SimpleButton from '../../../buttons/base/simple';
import {useForm} from 'react-hook-form';
import {emailRegex} from '../../../../utils/validate';
import {getSSORedirect} from '../../../../../data/shared/queries';
import {ApolloContext} from '../../../../enhancers/graphql-enhancer';
import {PAGE_WIDTH} from '../../../../style/dimensions';

const Container = glamorous.div({
  margin: '0 auto',
  maxWidth: PAGE_WIDTH
});

const Back = glamorous.div({
  ...BASE_TEXT,
  fontWeight: 'bold',
  fontSize: 14,
  margin: '10px 0',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ' > svg': {
    marginRight: 5
  }
});

const Form = glamorous.form({
  width: 350,
  margin: '0 auto 50px auto'
});

const Title = glamorous(BigTitle)({
  fontSize: 20,
  margin: 0,
  marginBottom: 50
});

const Button = glamorous(SimpleButton)({
  marginTop: 25,
  height: 50,
  fontSize: 14,
  fontWeight: 'bold',
  width: '100%'
});

const TitleContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '> svg': {
    marginRight: 10
  }
});

const handleInputChange = (e, setValues, setError) => {
  setError(false);
  const {name, value} = e.target;
  setValues(prevState => {
    return {
      ...prevState,
      [name]: value
    };
  });
};

const SingleSignOn = ({setSso}) => {
  const [values, setValues] = useState({email: ''});
  const [error, setError] = useState(false);
  const client = useContext(ApolloContext);
  const {handleSubmit, errors, register} = useForm();

  const onSubmit = () => {
    setError(false);
    client
      .query({
        query: getSSORedirect,
        variables: {
          email: values.email
        }
      })
      .then(({data}) => {
        if (data.getSSORedirect.sso) {
          window.location = data.getSSORedirect.redirect_url;
        } else {
          setError(true);
        }
      });
  };

  return (
    <Container>
      <Back onClick={() => setSso(false)}>
        <BackIcon />
        Back to sign in options
      </Back>
      <TitleContainer>
        <SSOIcon /> <Title>SSO Sign in</Title>
      </TitleContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          inputRef={register({
            pattern: emailRegex
          })}
          error={
            (errors.email && 'Not a valid email, check it and try again.') ||
            (error && 'This email is not configured to use SSO.')
          }
          name="email"
          placeholder="Enter your email address..."
          label="Email"
          id="email"
          onChange={e => handleInputChange(e, setValues, setError)}
        />
        <Button disabled={!values.email}>Authenticate</Button>
      </Form>
    </Container>
  );
};

SingleSignOn.propTypes = {
  setSso: PropTypes.func
};

export default withApollo(SingleSignOn);
