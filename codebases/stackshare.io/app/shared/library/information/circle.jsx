import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ALPHA} from '../../../shared/style/color-utils';
import {TARMAC, FOCUS_BLUE, SHADOW, CHARCOAL, WHITE} from '../../../shared/style/colors';
import {BASE_TEXT} from '../../style/typography';
import PopoverWithAnchor from '../popovers/base-v2';
import {TOP} from '../../constants/placements';

const Container = glamorous.div({
  margin: '10px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 100,
  ...BASE_TEXT
});

export const Icon = glamorous.div(
  {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: ALPHA(FOCUS_BLUE, 0.1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '> svg': {
      ' path': {
        fill: FOCUS_BLUE
      }
    }
  },
  ({iconSize}) => ({
    '> svg': {
      ...iconSize
    }
  })
);

const Count = glamorous.div({
  color: SHADOW,
  fontWeight: 'bold',
  fontSize: 12
});

const Name = glamorous.div({
  color: TARMAC,
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 12,
  marginTop: 5
});

const InformationCircle = ({
  icon,
  count,
  name,
  toolTip = '',
  iconSize = {width: 10, height: 10}
}) => {
  return (
    <Container>
      {toolTip ? (
        <PopoverWithAnchor
          customStyle={{backgroundColor: CHARCOAL, color: WHITE}}
          arrowColor={CHARCOAL}
          padding={10}
          placement={TOP}
          activateMode="hover"
          modifiersOffset={false}
          hidden={true}
          anchor={
            <Icon iconSize={iconSize}>
              {icon}
              <Count>{count}</Count>
            </Icon>
          }
        >
          {toolTip}
        </PopoverWithAnchor>
      ) : (
        <Icon iconSize={iconSize}>
          {icon}
          <Count>{count}</Count>
        </Icon>
      )}
      {name && <Name>{name}</Name>}
    </Container>
  );
};

InformationCircle.propTypes = {
  icon: PropTypes.object,
  toolTip: PropTypes.string,
  count: PropTypes.number,
  name: PropTypes.string,
  iconSize: PropTypes.object
};

export default InformationCircle;
