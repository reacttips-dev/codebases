import React from 'react';
import { SvgButton, color, ButtonType } from '@coursera/coursera-ui';
import withSingleTracked from 'bundles/common/components/withSingleTracked';

import 'css!./__styles__/VideoToolbarButton';

const TrackedSvgButton = withSingleTracked({ type: 'BUTTON' })(SvgButton);

type Props = {
  label: string;
  trackingName: string;
  onClick?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  tag?: React.ElementType;
  htmlAttributes?: { [htmlAttribute: string]: string | number };
  type: ButtonType;
  disabled?: boolean;
  svgElement: JSX.Element;
};

const VideoToolbarButton = ({
  label,
  trackingName,
  onClick,
  tag,
  htmlAttributes,
  type,
  disabled,
  svgElement,
}: Props) => {
  return (
    <TrackedSvgButton
      rootClassName="rc-VideoToolbarButton"
      style={{
        border: 'none',
        display: 'flex',
        fontWeight: 'normal',
        padding: '6px 12px',
        minHeight: '32px',
        fontSize: '14px',
        marginLeft: '6px',
        color: color.secondaryText,
      }}
      disabled={disabled}
      trackingName={trackingName}
      onClick={onClick}
      tag={tag}
      htmlAttributes={htmlAttributes}
      type={type}
      label={label}
      svgElement={svgElement}
    />
  );
};

export default VideoToolbarButton;
