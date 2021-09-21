import React from 'react';
import PropTypes from 'prop-types';

import Box from '../../../../../../shared/Box';
import Icon from '../../../../../../shared/Icon';
import Hoverable from '../../../../../../shared/Hoverable';
import Pressable from '../../../../../../shared/Pressable';
import Text from '../../../../../../shared/Text';

// Triangles do not look centered when they are:
//   https://medium.com/@erqiudao/the-play-button-is-not-optical-alignment-4cea11bda175

const getBoxColor = (colorScheme, isPressed, isHovering) => {
  if (colorScheme === 'dark') {
    if (isPressed) return '#040506';
    if (isHovering) return '#181c20';
    return '#292f36';
  }
  if (colorScheme === 'light') {
    if (isPressed) return '#C9CBCD';
    if (isHovering) return '#C9CBCD';
    return '#C9CBCD';
  }
  return '#C9CBCD';
};

const getIconMarginAndSize = (iconWidth, width) => {
  const calculatedIconWidth = iconWidth || width * 0.4;
  const leftMargin = calculatedIconWidth / 2 - calculatedIconWidth / 2.5;
  const topMargin = calculatedIconWidth / 2 - calculatedIconWidth / 2.3;
  return { leftMargin, topMargin, calculatedIconWidth };
};

const PlayButton = ({
  onClick,
  width,
  height,
  iconWidth,
  label,
  labelSize,
  labelColor,
  colorScheme,
}) => {
  const { leftMargin, topMargin, calculatedIconWidth } = getIconMarginAndSize(
    iconWidth,
    width
  );
  return (
    <Box>
      <Pressable
        onPress={() => {
          onClick();
        }}
        fullWidth
      >
        {({ isPressed }) => (
          <Box display="flex" alignItems="center">
            <Hoverable>
              {({ isHovering }) => (
                <Box
                  width={width}
                  height={height}
                  color={getBoxColor(colorScheme, isPressed, isHovering)}
                  shape="circle"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box width={calculatedIconWidth + leftMargin}>
                    <Box marginLeft={leftMargin}>
                      <Box
                        marginLeft={leftMargin}
                        marginTop={topMargin}
                        width={iconWidth}
                      >
                        <Icon
                          type="play"
                          fillColor={
                            colorScheme === 'dark' ? 'white' : '#333A40'
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Hoverable>
            {label && (
              <Box marginLeft={6}>
                <Text size={labelSize} color={labelColor} isBold>
                  {label}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Pressable>
    </Box>
  );
};

PlayButton.propTypes = {
  height: PropTypes.number.isRequired,
  iconWidth: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  label: PropTypes.string,
  labelSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  labelColor: PropTypes.string,
  colorScheme: PropTypes.string,
};

PlayButton.defaultProps = {
  label: null,
  labelSize: 'md',
  labelColor: '#292f36',
  colorScheme: 'dark',
};

export default PlayButton;
