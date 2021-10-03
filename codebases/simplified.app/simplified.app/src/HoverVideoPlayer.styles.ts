import React from 'react';

// CSS styles to make some contents in the player expand to fill the container
export const expandToFillContainerStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

interface SizingModeStyle {
  video: React.CSSProperties;
  overlay: React.CSSProperties;
  container: React.CSSProperties;
  manual: React.CSSProperties;
}

// Styles to apply to the paused overlay wrapper for each sizing mode
export const pausedOverlayWrapperSizingStyles: SizingModeStyle = {
  // Sizing should be based on the video element, so make the overlay
  // expand to cover the player's container element
  video: expandToFillContainerStyle,
  // Sizing should be based on the paused overlay, so set position: relative
  // to make it occupy space in the document flow
  overlay: {
    position: 'relative',
  },
  // Sizing should be based on the player's container element, so make the overlay
  // expand to cover it
  container: expandToFillContainerStyle,
  // Don't apply any preset styling to the overlay
  manual: null,
};

// Styles to apply to the video element for each sizing mode
export const videoSizingStyles: SizingModeStyle = {
  // Sizing should be based on the video element, so set display: block
  // to make sure it occupies space in the document flow
  video: {
    display: 'block',
    // Ensure the video is sized relative to the container's width
    // rather than the video asset's native width
    width: '100%',
  },
  // Make the video element expand to cover the container if we're sizing
  // based on the overlay or container
  overlay: expandToFillContainerStyle,
  container: expandToFillContainerStyle,
  // Don't apply any preset styling to the video
  manual: null,
};
