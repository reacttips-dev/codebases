import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {PAGE_WIDTH} from '../../../shared/style/dimensions';
import {BLACK, FOCUS_BLUE, WHITE} from '../../../shared/style/colors';
import GithubIcon from '../../../shared/library/icons/github.svg';
import Group68Icon from '../../../shared/library/icons/group-68.svg';
import SimpleButton from '../../../shared/library/buttons/base/simple';
import {PHONE} from '../../../shared/style/breakpoints';
import {githubMarketplace} from '../../private-landing/constants';

const Container = glamorous.div(
  {
    width: PAGE_WIDTH,
    margin: '0 auto',
    borderRadius: 3.5,
    boxShadow: '0 5px 12px 0 rgba(0, 0, 0, 0.09), 0 0 2px 0 rgba(0, 0, 0, 0)',
    background: WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '35px 70px 43px 70px',
    [PHONE]: {
      maxWidth: PAGE_WIDTH,
      flexDirection: 'column',
      width: '100%',
      padding: '40px 0'
    }
  },
  ({extraStyle}) => extraStyle
);

const ImageWithText = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  [PHONE]: {
    flexDirection: 'column'
  }
});

const ImageDiv = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const Github = glamorous(GithubIcon)({
  width: 88,
  marginRight: 25,
  height: 'auto',
  '> path': {
    fill: BLACK
  }
});

const Group68 = glamorous(Group68Icon)({
  width: 117,
  height: 'auto'
});

const Text = glamorous.div({
  fontSize: 24,
  fontWeight: 'bold',
  lineHeight: 1.29,
  letterSpacing: 0.09,
  color: BLACK,
  maxWidth: 455,
  marginLeft: 35,
  height: 'fit-content',
  '> a': {
    color: FOCUS_BLUE,
    cursor: 'pointer',
    textDecoration: 'none'
  },
  [PHONE]: {
    maxWidth: 240,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.56,
    letterSpacing: 0.07,
    textAlign: 'center',
    padding: '30px 0',
    margin: 0
  }
});

const LearnMore = glamorous(SimpleButton)({
  minWidth: 193,
  height: 50,
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: 0.06
});

const GithubMarketplace = ({extraStyle = {}, id}) => {
  return (
    <Container extraStyle={extraStyle} id={`GithubMarketplace-${id}`}>
      <ImageWithText>
        <ImageDiv>
          <Github />
          <Group68 />
        </ImageDiv>
        <Text>
          Private StackShare is now available for free on the{' '}
          <a onClick={() => window.open(githubMarketplace, '_self')}>GitHub Marketplace</a>
        </Text>
      </ImageWithText>
      <LearnMore onClick={() => window.open(githubMarketplace, '_self')}>Learn More</LearnMore>
    </Container>
  );
};

GithubMarketplace.propTypes = {
  extraStyle: PropTypes.object,
  id: PropTypes.string
};

export default GithubMarketplace;
