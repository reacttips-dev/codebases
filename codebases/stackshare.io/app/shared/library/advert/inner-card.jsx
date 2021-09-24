import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE, SCORE, CHARCOAL, GUNSMOKE, ASH} from '../../style/colors';
import {WEIGHT} from '../../style/typography';
import {ROW, COLUMN, THEMES} from './themes';
import {PHONE} from '../../style/breakpoints';
import DecorativeButton from '../buttons/base/decorative';
import SimpleButton from '../buttons/base/simple';
import {truncateText} from '../../utils/truncate-text';

const RibbonWrapper = glamorous.div({
  height: 78,
  overflow: 'hidden',
  top: 0,
  left: 0,
  position: 'absolute'
});

const Ribbon = glamorous.div(
  {
    textAlign: 'center',
    transform: 'rotate(-45deg)',
    position: 'relative',
    right: 32,
    width: 116,
    backgroundColor: SCORE,
    color: WHITE,
    fontWeight: WEIGHT.BOLD,
    textTransform: 'uppercase',
    fontSize: 9,
    padding: '4px 0',
    top: 16,
    letterSpacing: 0.2
  },
  ({theme}) => THEMES[theme].Ribbon
);

const Content = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center'
  },
  ({theme}) => THEMES[theme].Content
);

const LogoContainer = glamorous.div(
  {
    flexShrink: 0,
    marginLeft: 5,
    border: `1px solid ${ASH}`,
    borderRadius: 2
  },
  ({theme}) => THEMES[theme].LogoContainer
);

const Logo = glamorous.img(
  {
    width: 50,
    height: 50
  },
  ({theme}) => THEMES[theme].Logo
);

const Info = glamorous.div(
  {
    textAlign: 'left',
    padding: 5,
    [PHONE]: {
      marginLeft: 10
    }
  },
  ({theme}) => THEMES[theme].Info
);

const Name = glamorous.div(
  {
    fontSize: 15,
    fontWeight: WEIGHT.BOLD,
    letterSpacing: 0.6,
    color: CHARCOAL
  },
  ({theme}) => THEMES[theme].Name
);

const Description = glamorous.div(
  {
    fontSize: 12,
    letterSpacing: 0.7,
    color: GUNSMOKE
  },
  ({theme}) => THEMES[theme].Description
);

const ButtonContainer = glamorous.div(
  {
    [PHONE]: {
      display: 'none'
    }
  },
  ({theme}) => THEMES[theme].ButtonContainer
);

const StyledSimpleButton = glamorous(SimpleButton)({
  fontSize: 12,
  letterSpacing: 0.8,
  paddingTop: 5,
  paddingBottom: 5,
  height: 'auto'
});

const InnerCard = ({theme, ctaText, text, name, imageUrl, truncateLength}) => (
  <Fragment>
    <RibbonWrapper>
      <Ribbon theme={theme}>Sponsored</Ribbon>
    </RibbonWrapper>
    <Content theme={theme}>
      <LogoContainer theme={theme}>
        <Logo theme={theme} alt={name} src={imageUrl} />
      </LogoContainer>
      <Info theme={theme}>
        <Name theme={theme}>{name}</Name>
        <Description theme={theme}>{truncateText(text, truncateLength, '...', true)}</Description>
      </Info>
    </Content>
    <ButtonContainer theme={theme}>
      {theme === COLUMN || theme === ROW ? (
        <DecorativeButton>{ctaText}</DecorativeButton>
      ) : (
        <StyledSimpleButton active={true}>{ctaText}</StyledSimpleButton>
      )}
    </ButtonContainer>
  </Fragment>
);

InnerCard.propTypes = {
  theme: PropTypes.string,
  ctaText: PropTypes.string,
  text: PropTypes.string,
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  truncateLength: PropTypes.number
};

export default InnerCard;
