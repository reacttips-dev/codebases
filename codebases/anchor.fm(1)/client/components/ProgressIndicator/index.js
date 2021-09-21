import React from 'react';
import { msToDigital } from '../../utils';

export default function ProgressIndicator({
  playedPosition = 0,
  playingPosition = 0,
}) {
  return <span>{msToDigital(playedPosition + playingPosition || 0)}</span>;
}
