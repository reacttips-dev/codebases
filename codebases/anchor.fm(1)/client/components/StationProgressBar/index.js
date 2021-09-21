import React from 'react';

class StationProgressBar extends React.Component {
  handleMouseUpOnProgressBar = evt => {
    const { min, max } = this.props;
    const { onSeekPlaybackPosition } = this.props;
    const rect = this.domNode.getBoundingClientRect();
    const positionInMs = (max - min) * ((evt.clientX - rect.x) / rect.width);
    onSeekPlaybackPosition(positionInMs);
  };

  render() {
    const {
      min = 0,
      max = 100,
      playedPosition = 0,
      playingPosition = 0,
      remainingPosition = 0,
      className,
      size = 15,
      playedColor = '#FFFFFF',
      playingColor = '#FFFFFF',
      remainingColor = 'rgba(255,255,255,0.5)',
      bgColor = '#5000b9',
    } = this.props;

    const playedPercent = positionToPercent(playedPosition, max, min);
    const playingPercent = positionToPercent(playingPosition, max, min);
    const remainingPercent = positionToPercent(remainingPosition, max, min);
    return (
      <div
        className={className}
        style={{ width: '100%', height: size, cursor: 'pointer' }}
        onMouseUp={this.handleMouseUpOnProgressBar}
        ref={node => {
          this.domNode = node;
        }}
      >
        <svg width="100%" height={size}>
          <rect x="0" y="0" height="100%" width="100%" fill={bgColor} />
          <rect
            x="0"
            y="0"
            height="100%"
            width={playedPercent}
            fill={playedColor}
          />
          <rect
            x={playedPercent}
            y="0"
            height="100%"
            width={remainingPercent}
            fill={remainingColor}
          />
          <rect
            x={playedPercent}
            y="0"
            height="100%"
            width={playingPercent}
            fill={playingColor}
          />
        </svg>
      </div>
    );
  }
}

export default StationProgressBar;

function positionToPercent(position, max = 100, min = 0) {
  if (max === min) {
    return '0%';
  }
  return `${Math.max((100 * (position - min)) / (max - min), 0)}%`;
}
