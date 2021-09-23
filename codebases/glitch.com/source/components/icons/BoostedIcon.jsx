import React from 'react';
import styled from 'styled-components';

export default function BoostedIcon({ variant, size, tooltip, className }) {
  const sizes = {
    regular: '24px',
    small: '18px',
    tiny: '13px',
  };
  const images = {
    default: 'images/boosted/boosted-default.png',
    inactive: 'images/boosted/boosted-inactive.png',
  };
  const StyledImage = styled.img`
    height: ${(props) => sizes[props.size] || sizes.regular};
    vertical-align: sub;
  `;

  return (
    <span data-tooltip={tooltip} data-tooltip-left>
      <StyledImage
        className={className}
        size={size}
        src={images[variant] || images.default}
        alt={`${variant === 'inactive' ? 'Inactive ' : ''}Boosted Apps icon`}
      />
    </span>
  );
}
