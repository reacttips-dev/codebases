import React, { Component } from 'react';

class SoundIndicator extends Component {
  componentDidUpdate() {
    const { isPlaying } = this.props;
    return isPlaying
      ? this.svg.unpauseAnimations()
      : this.svg.pauseAnimations();
  }

  render() {
    const {
      barHeight = 5,
      barWidth = 3,
      className = '',
      onClick,
      fgColor = 'rgba(255,255,255,0.6)',
      style = {},
    } = this.props;
    const nextBarX = 2 * barWidth;
    const totalHeight = 3 * barHeight;
    const offsets = ['0s', '0.2s', '0.4s'];
    return (
      <div
        onClick={onClick}
        className={className}
        style={{ ...style, width: totalHeight, height: totalHeight }}
      >
        <svg
          ref={node => {
            this.svg = node;
          }}
          width={totalHeight}
          height={totalHeight}
        >
          <g transform={`translate(0,${totalHeight})`}>
            <g transform="scale(1,-1)">
              {offsets.map((offset, index) => (
                <rect
                  x={index * nextBarX}
                  y="0"
                  width={barWidth}
                  height={barHeight}
                  fill={fgColor}
                  key={index}
                >
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="scale"
                    values="1,1; 1,3; 1,1"
                    begin={offset}
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </rect>
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default SoundIndicator;
