import React, { Component } from 'react';
import { connect } from 'react-redux';
import AudioWaveAnimation from '../AudioWaveAnimation';

const mapStateToProps = ({ browser, station }, { isEmbedded }) => ({
  width: getStationContainerOffsetFromBrowser(browser),
  height: getwaveHeightFromBrowser(browser, isEmbedded),
});

export default connect(mapStateToProps)(AudioWaveAnimation);

function getStationContainerOffsetFromBrowser(browser) {
  const { breakpoints, width } = browser;
  const OFFSETS = {
    SMALL: breakpoints.extraSmall,
    ANCHOR_TRANSITION_POINT: breakpoints.medium,
    MEDIUM: breakpoints.small,
  };
  // hack off-breakpoints in order to support an in-between breakpoint just for embed.
  if (width > OFFSETS.ANCHOR_TRANSITION_POINT && width < OFFSETS.MEDIUM) {
    return OFFSETS.ANCHOR_TRANSITION_POINT;
  }
  if (width > OFFSETS.MEDIUM) {
    return OFFSETS.MEDIUM;
  }
  return OFFSETS.SMALL;
}

function getwaveHeightFromBrowser(browser, isEmbedded) {
  const { mediaType } = browser;
  const HEIGHTS = {
    SMALL: 120,
    SMALL_EMBED: 120,
    MEDIUM: 219,
  };
  return {
    extraSmall: isEmbedded ? HEIGHTS.SMALL_EMBED : HEIGHTS.SMALL,
    small: isEmbedded ? HEIGHTS.SMALL_EMBED : HEIGHTS.SMALL,
    medium: HEIGHTS.MEDIUM,
    large: HEIGHTS.MEDIUM,
    extraLarge: HEIGHTS.MEDIUM,
    infinity: HEIGHTS.MEDIUM,
  }[mediaType];
}
