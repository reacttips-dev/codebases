import React from 'react';
import PropTypes from 'prop-types';
import Box from '../../../../../../shared/Box';
import Icon from '../../../../../../shared/Icon';
import Hoverable from '../../../../../../shared/Hoverable';
import Pressable from '../../../../../../shared/Pressable';
import Text from '../../../../../../shared/Text';

const getColor = (colorScheme, isPressed, isHovering) => {
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

const PauseButton = ({
  onClick,
  width,
  height,
  iconWidth,
  label,
  labelSize,
  labelColor,
  colorScheme,
}) => {
  const calculatedIconWidth = iconWidth || width * 0.4;
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
                  color={getColor(colorScheme, isPressed, isHovering)}
                  shape="circle"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box width={calculatedIconWidth}>
                    <Icon
                      type="pause"
                      fillColor={colorScheme === 'dark' ? 'white' : '#333A40'}
                    />
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

PauseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  iconWidth: PropTypes.number.isRequired,
  label: PropTypes.string,
  labelSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  labelColor: PropTypes.string,
  colorScheme: PropTypes.string,
};

PauseButton.defaultProps = {
  label: null,
  labelSize: 'md',
  labelColor: '#292f36',
  colorScheme: 'dark',
};

export default PauseButton;
