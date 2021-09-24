import React, {useState, useEffect} from 'react';
import glamorous from 'glamorous';
import {ALABASTER, GUNSMOKE, FOCUS_BLUE} from '../../../../shared/style/colors';
import BaseTitle from '../../../../shared/library/typography/big-title';
import BaseText from '../../../../shared/library/typography/text';
import {Github, BitBucket, GitLab, Twitter, Google} from '../../../../shared/library/buttons/auth';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {
  FEED_CLICK_SIGNUP_SOURCE_GITHUB,
  FEED_CLICK_SIGNUP_SOURCE_BITBUCKET,
  FEED_CLICK_SIGNUP_SOURCE_GITLAB,
  FEED_CLICK_SIGNUP_SOURCE_TWITTER,
  FEED_CLICK_SIGNUP_SOURCE_GOOGLE
} from '../../constants/analytics';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: ALABASTER,
  padding: 30,
  '>a': {
    marginBottom: 8
  }
});

const Title = glamorous(BaseTitle)({
  color: FOCUS_BLUE,
  marginBottom: 16
});

const Text = glamorous(BaseText)({
  marginBottom: 16
});

const Disclaimer = glamorous.div({
  ...BASE_TEXT,
  fontWeight: WEIGHT.DARK,
  fontSize: 10,
  lineHeight: '17px',
  letterSpacing: 0.2,
  color: GUNSMOKE,
  marginTop: 32,
  '>a,>a:visited': {
    color: GUNSMOKE,
    fontWeight: WEIGHT.BOLD
  }
});

const AuthCtaPanel = () => {
  const [doRender, setDoRender] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const variant = process.env.SIGNUP_EXPERIMENT_2 || 'control';

  useEffect(() => setDoRender(true), []);

  if (!doRender) return null;

  return (
    <Container>
      <Title>Customize your feed</Title>
      <Text>
        StackShare helps you stay on top of the developer tools and services that matter most to
        you.
      </Text>
      {variant === 'control' && (
        <>
          <Google
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GOOGLE}}
            invert
            redirect="/feed"
          />
          <Twitter
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_TWITTER}}
            invert
            redirect="/feed"
          />
          <Github
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITHUB}}
            invert
            redirect="/feed"
          />
          <BitBucket
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_BITBUCKET}}
            invert
            redirect="/feed"
          />
          <GitLab
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITLAB}}
            invert
            redirect="/feed"
          />
        </>
      )}
      {variant === 'variant-1' && (
        <>
          <Google
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GOOGLE}}
            invert
            redirect="/feed"
          />
          <Github
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITHUB}}
            invert
            redirect="/feed"
          />
          {showMore ? (
            <>
              <Twitter
                payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_TWITTER}}
                invert
                redirect="/feed"
              />
              <BitBucket
                payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_BITBUCKET}}
                invert
                redirect="/feed"
              />
              <GitLab
                payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITLAB}}
                invert
                redirect="/feed"
              />
            </>
          ) : (
            <a
              style={{alignSelf: 'center', textAlign: 'center'}}
              className="seeMore"
              href="#"
              onClick={event => {
                event.preventDefault();
                setShowMore(true);
              }}
            >
              Show more options to
              <br />
              <strong>Log in or Sign up</strong>
            </a>
          )}
        </>
      )}
      {variant === 'variant-2' && (
        <>
          <Twitter
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_TWITTER}}
            invert
            redirect="/feed"
          />
          <Github
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITHUB}}
            invert
            redirect="/feed"
          />
          <BitBucket
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_BITBUCKET}}
            invert
            redirect="/feed"
          />
          <GitLab
            payload={{'auth.source': FEED_CLICK_SIGNUP_SOURCE_GITLAB}}
            invert
            redirect="/feed"
          />
        </>
      )}
      <Disclaimer>
        By clicking the sign up button above, you agree to our <a href="/terms">Terms of Use</a> and{' '}
        <a href="/privacy">Privacy Policy</a>
      </Disclaimer>
    </Container>
  );
};

export default AuthCtaPanel;
