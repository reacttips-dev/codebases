import React from 'react';
import PropTypes from 'prop-types';

import Text from '../../../../shared/Text/index.tsx';
import Box from '../../../../shared/Box';
import IconBadge from '../../../IconBadge';

const MenuItem = ({ label, icon }) => (
  <Box
    key={label}
    height={48}
    paddingLeft={14}
    paddingRight={14}
    display="flex"
    alignItems="center"
  >
    {icon && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginRight={14}
      >
        <IconBadge
          type={icon.type}
          iconColor={icon.iconColor}
          backgroundColor={icon.backgroundColor}
          width={icon.width}
          padding={icon.padding}
        />
      </Box>
    )}
    <Text color="#292f36" isBold size="xl" isInline>
      {label}
    </Text>
  </Box>
);

MenuItem.defaultProps = { icon: null };
MenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.shape({
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    padding: PropTypes.number,
    type: PropTypes.string,
    width: PropTypes.number,
  }),
};

export { MenuItem };
