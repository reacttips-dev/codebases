import React from "react";
import { Handles, Rail, Slider, Tracks } from "react-compound-slider";
import PropTypes from "prop-types";

const sliderStyle = {
  position: "relative",
  height: "100%",
  touchAction: "none",
};

const railStyle = {
  width: "5px",
  height: "100%",
  marginTop: 0,
};

function Track({ source, target, getTrackProps }) {
  return (
    <div
      className="tldr-track"
      style={{
        top: `${source.percent}%`,
        height: `${target.percent - source.percent}%`,
        width: "5px",
        marginTop: 0,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
}

function Handle({
  handle: { id, value, percent },
  getHandleProps,
  showDecimals,
}) {
  return (
    <div
      className="tldr-handle"
      style={{
        top: `${percent}%`,
        marginTop: "-9px",
      }}
      {...getHandleProps(id)}
    ></div>
  );
}

const VolumeSlider = ({ value, onChange }) => {
  let sliderValue = [0];
  if (!!value) {
    sliderValue = [value];
  }

  return (
    <Slider
      className="tldr-slider"
      mode={1}
      step={0.1}
      vertical
      domain={[0, 100]}
      rootStyle={sliderStyle}
      onChange={onChange}
      values={sliderValue}
      reversed
    >
      <Rail>
        {({ getRailProps }) => (
          <div className="tldr-rail" style={railStyle} {...getRailProps()} />
        )}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                domain={[0, 100]}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
          </div>
        )}
      </Tracks>
    </Slider>
  );
};

VolumeSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default VolumeSlider;
