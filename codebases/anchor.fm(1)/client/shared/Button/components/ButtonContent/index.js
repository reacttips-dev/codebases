import React from 'react';
import PropTypes from 'prop-types';

import Box from '../../../Box';

// TODO:
// Fix the size of the button when default loading is used

const ButtonContent = ({
  renderIcon,
  renderLoading,
  renderContent,
  paddingY,
  paddingX,
  isTextFirst,
  height,
}) => (
  <Box
    display="flex"
    alignContent="center"
    justifyContent="center"
    paddingTop={paddingY}
    paddingBottom={paddingY}
    paddingLeft={paddingX}
    paddingRight={paddingX}
    height={height}
  >
    {isTextFirst ? (
      <React.Fragment>
        <Box marginTop="auto" marginBottom="auto">
          {renderContent()}
        </Box>
        {renderIcon && renderIcon() && (
          <Box marginTop="auto" marginBottom="auto">
            {renderIcon()}
          </Box>
        )}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {renderIcon && renderIcon() && (
          <Box marginTop="auto" marginBottom="auto">
            {renderIcon()}
          </Box>
        )}
        <Box marginTop="auto" marginBottom="auto">
          {renderContent()}
        </Box>
      </React.Fragment>
    )}
    {renderLoading && renderLoading() && (
      <Box marginTop="auto" marginBottom="auto" marginLeft={10}>
        {renderLoading()}
      </Box>
    )}
  </Box>
);

ButtonContent.defaultProps = {
  paddingY: 0,
  paddingX: 0,
  renderIcon: null,
  renderLoading: null,
};

ButtonContent.propTypes = {
  renderIcon: PropTypes.func,
  renderLoading: PropTypes.func,
  renderContent: PropTypes.func.isRequired,
  paddingY: PropTypes.number,
  paddingX: PropTypes.number,
};

export default ButtonContent;
