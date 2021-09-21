import React, { Component } from 'react';
import Fade from 'react-bootstrap/lib/Fade';
import {
  clearInterval,
  setInterval,
} from '../../../helpers/serverRenderingUtils';

let f = 0;
const SIXTY_FPS = 1000 / 60;
const RAMP_LENGTH = 30; // for play/pause amplitude transition
class AudioWaveAnimation extends Component {
  constructor(props, context) {
    super(props, context);
    this.updateDrawing = this.updateDrawing.bind(this);
    this.state = {};
  }

  componentDidMount() {
    f = 0;
    this.setState({ interval: setInterval(this.updateDrawing, SIXTY_FPS) });
  }

  componentWillReceiveProps({ width, height, isPlaying }) {
    this.updateDrawing(width, height); // sync so that things like width, height, trigger drawing
    if (isPlaying !== this.props.isPlaying) {
      // save f value to ramp up or down the wave
      this.setState({ f });
    }
  }

  componentWillUnmount() {
    return this.state.interval && clearInterval(this.state.interval);
  }

  updateDrawing(newWidth, newHeight) {
    const { width = 300, height = 100, volumeData, isPlaying } = this.props;
    if (newWidth === width && newHeight === height) {
      return;
    }
    //  const waveWidth = frameWidth / numberOfWavesPerFrame;
    const waveWidth = newWidth || width;
    const waveHeight = newHeight || height;
    if (this.state.f && f - this.state.f >= RAMP_LENGTH) {
      this.state.interval && this.setState({ f: null });
    }
    let frac = this.state.f ? (f - this.state.f) / RAMP_LENGTH : 1;
    if (!isPlaying) frac = 1 - frac; // approach zero for pause
    f++;
    const multiplier = frac * volumeData[f % volumeData.length];
    f = f % (10 * volumeData.length); // keep f from growing too large
    const points = getBezierPoints(multiplier, waveWidth, waveHeight, f);
    if (!points.length) {
      return;
    }
    let pointsStr = `M ${points[0].actualPoint.x} ${points[0].actualPoint.y}`;
    for (let p = 0; p < points.length; p++) {
      const cp = points[p].controlPoint;
      const ap = points[p].actualPoint;
      pointsStr = `${pointsStr} Q ${cp.x} ${cp.y}, ${ap.x} ${ap.y}`;
    }
    // draw some extra paths to connect the lower shape to fill in below the waveform
    const firstPoint = points[0].actualPoint;
    const lastPoint = points[points.length - 1].actualPoint;
    pointsStr = `${pointsStr} L ${lastPoint.x} ${waveHeight}`;
    pointsStr = `${pointsStr} L ${firstPoint.x} ${waveHeight}`;
    pointsStr = `${pointsStr} Z`;
    return this.state.interval && this.setState({ pointsStr });
  }

  render() {
    const {
      className,
      width = 300,
      height = 100,
      fgColor = '#FFFFFF',
      isPlaying = false,
    } = this.props;
    return (
      <div className={className}>
        <Fade in={!!this.state} timeout={800}>
          <svg
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              transform: 'translate3d(0, 0, 0)',
            }}
            viewBox={`0 0 ${width} ${height}`}
          >
            {this.state && (
              <path
                stroke="transparent"
                fill={fgColor}
                d={this.state.pointsStr}
              />
            )}
          </svg>
        </Fade>
      </div>
    );
  }
}

export default AudioWaveAnimation;

function getBezierPoints(_multiplier, w = 1024, h = 576, f = 0) {
  const FRAME_RATE = 60;
  const WAVE_COLOR = 'rgba(255,255,255,0.15)';
  const FRAME_WIDTH = w;
  const FRAME_HEIGHT = h;
  const WAVE_OPTIONS = {
    // TODO: pass breakpoints all the way to this component instead of hardcoding 294 (small)?
    numberOfWavesPerFrame: FRAME_WIDTH > 294 ? 3.5 : 1.5,
    waveControlHeightPercentOfWidth: 1,
    frequency: 0.3,
    startOffset: 30,
    baseLinePercent: 0.5,
    minWavePercentHeight: 0.17,
  };

  const frameDrawerOptions = {
    backgroundColor: '#745FFC',
    waveColor: WAVE_COLOR,
    frameWidth: FRAME_WIDTH,
    frameHeight: FRAME_HEIGHT,
    waveOptions: WAVE_OPTIONS,
    frameRate: FRAME_RATE,
  };

  const {
    baseLinePercent,
    numberOfWavesPerFrame,
    waveControlHeightPercentOfWidth,
    frequency,
    startOffset,
    minWavePercentHeight,
    frameDelay,
  } = frameDrawerOptions.waveOptions;

  const { frameWidth, frameHeight, frameRate } = frameDrawerOptions;

  const waveWidth = frameWidth / numberOfWavesPerFrame;
  const pixelsMovedPerFrame = (frequency * waveWidth) / frameRate;
  const startX = -(startOffset + ((f * pixelsMovedPerFrame) % waveWidth));
  let currX = startX;
  const points = [];
  const currRelativeYLocation = 0;
  const currY = 0;
  let currYDirection = 1;
  const currControlPointDirection = -1;

  // Computed values
  const baseLine = baseLinePercent * frameHeight;
  const multiplier = _multiplier
    ? Math.max(minWavePercentHeight, _multiplier)
    : minWavePercentHeight;
  const waveControlHeight =
    waveControlHeightPercentOfWidth * waveWidth * multiplier;
  const halfWaveHeight = waveControlHeight / 2;
  const halfWaveWidth = waveWidth / 2;
  const quarterWaveWidth = halfWaveWidth / 2;

  while (currX < frameWidth + waveWidth) {
    points.push({
      actualPoint: {
        x: hr(currX),
        y: hr(baseLine + currY),
      },
      controlPoint: {
        x: hr(currX - quarterWaveWidth),
        y: hr(baseLine + halfWaveHeight * currYDirection),
      },
    });

    currX = currX + halfWaveWidth;
    currYDirection = currYDirection * -1;
  }

  return points;
}

// Hundredth rounding
function hr(num) {
  return Math.floor(num * 100) / 100;
}
