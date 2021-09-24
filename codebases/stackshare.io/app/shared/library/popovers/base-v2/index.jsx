import React, {cloneElement, useState, useContext, createContext} from 'react';
import PropTypes from 'prop-types';
import usePopper from './popper-hook';
import * as PLACEMENTS from '../../../constants/placements';
import ArrowContainer from './arrow';
import PopoverPanel from './panel';
import Arrow from './arrow.svg';
import {grid} from '../../../utils/grid';

export const PopperOffsetContext = createContext('0,0');

const PopoverWithAnchor = ({
  anchor,
  placement,
  children,
  width = 'auto',
  padding = grid(2),
  hidden,
  customStyle,
  arrowColor,
  onActivate,
  activateMode = 'manual',
  modifiersOffset = true,
  arrowStyle = {}
}) => {
  const {Manager, Reference, Popper} = usePopper();
  const [show, setShow] = useState(!hidden);
  const offset = useContext(PopperOffsetContext);

  const refProp = ref =>
    anchor.type && anchor.type.isGlamorousComponent ? {innerRef: ref} : {ref};

  const eventProps = () => {
    if (activateMode === 'hover') {
      return {
        onMouseOut: () => setShow(false),
        onMouseOver: () => {
          if (!show) {
            onActivate && onActivate();
            setShow(true);
          }
        }
      };
    }
    return {};
  };

  return Manager ? (
    <Manager>
      <Reference>
        {({ref}) =>
          cloneElement(anchor, {
            ...refProp(ref),
            ...eventProps()
          })
        }
      </Reference>
      {(activateMode === 'manual' ? !hidden : show) && (
        <Popper
          placement={placement}
          modifiers={{
            offset: {enabled: modifiersOffset, offset},
            preventOverflow: {enabled: true}
          }}
        >
          {({ref, style, placement, arrowProps}) => (
            <PopoverPanel
              width={width}
              padding={padding}
              innerRef={ref}
              style={{...style, ...customStyle}}
              data-placement={placement}
            >
              {children}
              <ArrowContainer
                innerRef={arrowProps.ref}
                data-placement={placement}
                style={{...arrowStyle, ...arrowProps.style}}
                arrowColor={arrowColor}
              >
                <Arrow />
              </ArrowContainer>
            </PopoverPanel>
          )}
        </Popper>
      )}
    </Manager>
  ) : (
    anchor
  );
};

PopoverWithAnchor.propTypes = {
  children: PropTypes.any,
  anchor: PropTypes.element,
  placement: PropTypes.oneOf([...Object.values(PLACEMENTS)]),
  width: PropTypes.number,
  padding: PropTypes.number,
  hidden: PropTypes.bool,
  customStyle: PropTypes.object,
  arrowColor: PropTypes.string,
  onActivate: PropTypes.func,
  activateMode: PropTypes.oneOf(['manual', 'hover']),
  modifiersOffset: PropTypes.bool,
  arrowStyle: PropTypes.object
};

export default PopoverWithAnchor;
