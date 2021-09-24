import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CATHEDRAL} from '../../../style/colors';
import {FONT_FAMILY} from '../../../style/typography';
import ServiceTile, {MICRO} from '../../tiles/service.jsx';
import ScrollPanel from '../../panels/scroll/index.jsx';
import PopoverWithAnchor, {
  ACTIVATE_MODE_CLICK,
  ACTIVATE_MODE_HOVER,
  AUTO_FIT_VERTICAL
} from '../base';
import {MobileContext} from '../../../enhancers/mobile-enhancer';

const WIDTH = 175;
const HEIGHT = 108;

const Item = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: 1,
  marginBottom: 5,
  marginRight: 5,
  minHeight: 22,
  fontFamily: FONT_FAMILY,
  fontSize: 11,
  color: CATHEDRAL,
  alignItems: 'center',
  '> :first-child': {
    marginRight: 9
  },
  ':last-child': {
    marginBottom: 0
  },
  '& a': {
    textDecoration: 'none',
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    color: CATHEDRAL
  }
});

export default class ServiceListPopover extends Component {
  static propTypes = {
    services: PropTypes.array.isRequired,
    children: PropTypes.any,
    onClick: PropTypes.func
  };

  render() {
    const {services, children, onClick} = this.props;
    return (
      <MobileContext.Consumer>
        {isMobile => (
          <PopoverWithAnchor
            width={WIDTH}
            anchor={children}
            autoFit={AUTO_FIT_VERTICAL}
            activateMode={isMobile ? ACTIVATE_MODE_CLICK : ACTIVATE_MODE_HOVER}
            deactivateMode={isMobile ? ACTIVATE_MODE_CLICK : ACTIVATE_MODE_HOVER}
          >
            <ScrollPanel height={HEIGHT}>
              {services.map(({id, name, imageUrl, canonicalUrl}) => (
                <Item
                  key={name}
                  onClick={() => {
                    onClick(id, name, canonicalUrl);
                  }}
                >
                  <ServiceTile
                    size={MICRO}
                    name={name}
                    href={canonicalUrl}
                    imageUrl={imageUrl}
                    rounded={true}
                    preventDefault={false}
                  />{' '}
                  <a href={canonicalUrl}>{name}</a>
                </Item>
              ))}
            </ScrollPanel>
          </PopoverWithAnchor>
        )}
      </MobileContext.Consumer>
    );
  }
}
