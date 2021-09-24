import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {formatCount} from '../../../../shared/utils/format';
import ServiceTile, {LARGE} from '../../tiles/service';
import {CHARCOAL, CONCRETE, FOCUS_BLUE, TARMAC, WHITE} from '../../../style/colors';
import {FONT_FAMILY, WEIGHT} from '../../../style/typography';
import VerfiedIcon from '../../icons/verified.svg';
import FollowButton from '../../buttons/follow';
import {MobileContext} from '../../../enhancers/mobile-enhancer';
import PopoverWithAnchor, {
  ACTIVATE_MODE_CLICK,
  ACTIVATE_MODE_HOVER,
  AUTO_FIT_VERTICAL
} from '../base';

const DetailsPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  paddingBottom: 13,
  marginBottom: 7,
  borderBottom: `0.7px solid ${CONCRETE}`
});

const BtnContainer = glamorous.div({
  display: 'flex',
  '>a': {
    width: '50%'
  },
  '>button': {
    marginRight: 10
  }
});

const GhostLink = glamorous.a({
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 32,
  borderRadius: 2,
  color: FOCUS_BLUE,
  ':hover': {
    borderColor: FOCUS_BLUE,
    background: FOCUS_BLUE,
    color: WHITE
  },
  border: `1px solid ${FOCUS_BLUE}`,
  outline: 'none'
});

const Name = glamorous.a({
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  fontWeight: WEIGHT.BOLD,
  letterSpacing: 0.8,
  color: CHARCOAL,
  textDecoration: 'none',
  ':hover': {
    color: CHARCOAL
  }
});

const Title = glamorous.div({
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  lineHeight: 1.58,
  letterSpacing: 0.5,
  width: 208,
  color: TARMAC,
  marginBottom: 10
});

const Details = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 13
});

const Stats = glamorous.div({
  display: 'flex',
  flexDirection: 'row'
});

const Stat = glamorous(Name)(
  {
    fontSize: 20,
    textAlign: 'center',
    flex: 1
  },
  ({label}) => ({
    '::before': {
      content: label,
      fontSize: 12,
      fontWeight: WEIGHT.NORMAL,
      color: TARMAC,
      lineHeight: 1.58,
      letterSpacing: 0.5,
      display: 'block'
    }
  })
);

export default class ServiceDetailsPopover extends Component {
  static propTypes = {
    children: PropTypes.any,
    onFollowToggle: PropTypes.func,
    onActivate: PropTypes.func,
    service: PropTypes.shape({
      name: PropTypes.string,
      imageUrl: PropTypes.string,
      canonicalUrl: PropTypes.string,
      verified: PropTypes.bool,
      following: PropTypes.bool,
      title: PropTypes.string,
      votes: PropTypes.number,
      fans: PropTypes.number,
      stacks: PropTypes.number
    }).isRequired,
    showFollow: PropTypes.bool,
    onClick: PropTypes.func,
    showJobs: PropTypes.bool
  };

  static defaultProps = {
    showFollow: true
  };

  renderFollowButton() {
    const {
      showFollow,
      onFollowToggle,
      service: {following}
    } = this.props;
    if (showFollow) {
      return <FollowButton onToggle={onFollowToggle} following={following} />;
    }
  }

  render() {
    const {
      children,
      onActivate,
      service: {name, imageUrl, canonicalUrl, verified, title, votes, fans, stacks, slug},
      onClick,
      showJobs
    } = this.props;

    return (
      <MobileContext.Consumer>
        {isMobile => (
          <PopoverWithAnchor
            anchor={children}
            autoFit={AUTO_FIT_VERTICAL}
            onActivate={onActivate}
            activateMode={isMobile ? ACTIVATE_MODE_CLICK : ACTIVATE_MODE_HOVER}
            deactivateMode={isMobile ? ACTIVATE_MODE_CLICK : ACTIVATE_MODE_HOVER}
          >
            <DetailsPanel>
              <ServiceTile
                size={LARGE}
                name={name}
                href={canonicalUrl}
                imageUrl={imageUrl}
                onClick={onClick}
                preventDefault={false}
              />
              <Details>
                <Name href={canonicalUrl} onClick={onClick}>
                  {name} {verified && <VerfiedIcon />}
                </Name>
                <Title>{title}</Title>
                <BtnContainer>
                  {this.renderFollowButton()}
                  {showJobs && (
                    <GhostLink href={`/jobs/${slug}`} title={`${name} Jobs`}>
                      View Jobs
                    </GhostLink>
                  )}
                </BtnContainer>
              </Details>
            </DetailsPanel>
            <Stats>
              <Stat label="Stacks">{formatCount(stacks)}</Stat>
              <Stat label="Fans">{formatCount(fans)}</Stat>
              <Stat label="Votes">{formatCount(votes)}</Stat>
            </Stats>
          </PopoverWithAnchor>
        )}
      </MobileContext.Consumer>
    );
  }
}
