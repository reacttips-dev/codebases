import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import GithubUser from './github_user.svg';
import {ALPHA} from '../../../style/color-utils';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {PHONE} from '../../../style/breakpoints';
import {skipForceVcsConnection} from '../../../../data/shared/mutations';
import {user} from '../../../../data/shared/queries';
import {MAKO, WHITE} from '../../../style/colors';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 20
});

const Button = glamorous.a(({customStyle, customStyleHover}) => ({
  ...BASE_TEXT,
  minWidth: 152,
  height: 40,
  letterSpacing: 'normal',
  fontSize: 13,
  margin: 0,
  paddingLeft: 12,
  paddingRight: 12,
  lineHeight: '40px',
  textAlign: 'center',
  textDecoration: 'none',
  color: WHITE,
  ...customStyle,
  ':hover': {
    ...customStyleHover
  }
}));

const SubText = glamorous.div({
  ...BASE_TEXT,
  fontSize: 16,
  fontWeight: WEIGHT.NORMAL,
  marginBottom: 30,
  textAlign: 'center',
  color: MAKO
});

const Heading = glamorous.h1({
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  marginBottom: 10,
  [PHONE]: {
    margin: '0px auto 25px auto'
  },
  fontSize: 20,
  textAlign: 'center'
});

const SkipText = glamorous.p({
  ...BASE_TEXT,
  fontWeight: WEIGHT.NORMAL,
  marginTop: 9,
  fontSize: 11,
  textAlign: 'center',
  color: '#828282',
  '&:hover': {
    cursor: 'pointer'
  }
});

const SsoGithubCta = ({client, skipCta, pageReload}) => {
  const skipVcsConnection = async () => {
    if (skipCta) {
      skipCta();
      if (pageReload) window.location.reload();
    } else {
      try {
        await client.mutate({
          mutation: skipForceVcsConnection,
          refetchQueries: [{query: user}],
          awaitRefetchQueries: true
        });
        if (pageReload) window.location.reload();
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
        alert(
          'There was a problem processing your request. Please try again and if the problem persists please email us at contact@stackshare.io.'
        );
      }
    }
  };

  return (
    <Container>
      <GithubUser />
      <Heading>Please connect your user profile to your GitHub account</Heading>
      <SubText>
        {`According to your company's policies, you need to connect your user profile to your GitHub
        account to access this page`}
      </SubText>
      <Button
        href="/users/auth/github"
        customStyle={{marginRight: 8, background: '#222', borderColor: '#222'}}
        customStyleHover={{
          backgroundColor: ALPHA('#222', 0.8),
          borderColor: ALPHA('#222', 0.79),
          color: WHITE
        }}
      >
        Connect to Github
      </Button>
      <SkipText onClick={() => skipVcsConnection()}>I don’t have a GitHub account</SkipText>
    </Container>
  );
};

SsoGithubCta.propTypes = {
  client: PropTypes.object,
  skipCta: PropTypes.func,
  pageReload: PropTypes.bool
};

export default SsoGithubCta;
