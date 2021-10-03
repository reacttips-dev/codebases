import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { Slider, Handles, Tracks } from "react-compound-slider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import {
  grey,
  lightGrey,
  accent,
  accentLight,
  primary,
} from "../../../../styled/variable";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../../../../_actions/types";

// Extend dayjs duration plugin
dayjs.extend(duration);

const MusicItemWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  transition: transform 0.2s;
  border-radius: 8px;
  background-color: #424242;
  z-index: 10;

  .visualizer {
    position: relative;
    width: 100%;
    height: 75px;

    .play-pause-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      padding: 0;
      border: 0;
      background: inherit;
      cursor: pointer;
      outline: none;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 25px;
      width: 25px;
      border-radius: 50%;
      background-color: ${(props) =>
        props.playState === "play" ? primary : "#848484"};

      svg {
        width: 12px;
        height: 12px;
      }
    }

    .thumb {
      background-color: #202020;
      filter: grayscale(100%);
      padding: 5px 0;
      width: 100%;
      height: 73px;
    }
  }

  .details {
    margin: 8px;
    overflow: hidden;
    cursor: pointer;

    .title {
      color: ${lightGrey};
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      &:not(:hover) {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* animate on either hover or focus */
      &:hover,
      &:focus {
        animation-name: scroll-text;
        animation-duration: 7s;
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-direction: normal;
      }

      /* define the animation */
      @keyframes scroll-text {
        0% {
          transform: translateX(0%);
        }
        90% {
          transform: translateX(-100%);
        }
        95% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(0%);
        }
      }
    }

    .duration {
      color: ${grey};
      font-size: 12px;
      font-weight: 500;
    }
  }

  :hover {
    transform: scale(1.1);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  }
`;

const sliderStyle = {
  // Give the slider some width
  position: "relative",
  width: "100%",
  height: 2,
  marginTop: -5,
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 3,
  marginTop: 0,
  borderRadius: 0,
  backgroundColor: grey,
};

export function SeekerHandle({
  handle: { id, value, percent },
  getHandleProps,
  isPlaying,
  hidden,
}) {
  return (
    <div
      style={{
        position: "absolute",
        marginTop: "-2px",
        zIndex: 2,
        width: "8px",
        height: "8px",
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: isPlaying ? accent : "white",
        color: "#333",
        left: `${percent}%`,
        display: hidden ? "none" : "inherit",
      }}
      {...getHandleProps(id)}
    ></div>
  );
}

function SeekerTrack({ source, target, getTrackProps, isPlaying }) {
  return (
    <div
      style={{
        position: "absolute",
        height: 3,
        zIndex: 1,
        marginTop: 0,
        backgroundColor: isPlaying ? accentLight : "white",
        borderRadius: 0,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
}

function MusicPlayerSeeker({
  totalDuration,
  currentDuration,
  onSeek,
  playState,
}) {
  if (!totalDuration) return null;

  const hidden =
    !totalDuration || (currentDuration === 0 && playState === "pause");

  return (
    <Slider
      rootStyle={{ ...sliderStyle, opacity: hidden ? "0" : "inherit" }}
      domain={[0, totalDuration]}
      values={[currentDuration]}
      onSlideEnd={onSeek}
    >
      <div style={railStyle} />
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <SeekerHandle
                isPlaying={playState === "play"}
                key={handle.id}
                handle={handle}
                getHandleProps={getHandleProps}
                hidden={hidden}
              />
            ))}
          </div>
        )}
      </Handles>
      <Tracks right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <SeekerTrack
                isPlaying={playState === "play"}
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
}

const MusicItem = ({
  data,
  data: { title, duration, meta, src },
  onClick,
  onPlay,
}) => {
  const audioRef = useRef(null);
  const elRef = useRef(null);
  const [{ isDragging }, drag, dragPreview] = useDrag({
    item: {
      type: ItemTypes.CARD,
      payload: data,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [playState, setPlayState] = useState("pause");
  const [{ totalDuration, currentDuration }, setDurationData] = useState({
    totalDuration: null,
    currentDuration: null,
  });

  let durationLabel = null;

  if (duration) {
    durationLabel = `${dayjs
      .duration(duration, "seconds")
      .format("mm:ss")} minutes`;
  }

  const listenToMetaData = () => {
    setDurationData({
      totalDuration: Math.floor(audioRef.current.duration),
      currentDuration: 0,
    });
  };

  const listenToTimeUpdate = () => {
    setDurationData({
      totalDuration: Math.floor(audioRef.current.duration),
      currentDuration: Math.floor(audioRef.current.currentTime),
    });
  };

  const listenToPlaybackEnd = () => {
    setDurationData({
      totalDuration: Math.floor(audioRef.current.duration),
      currentDuration: 0,
    });
    setPlayState("pause");
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener("loadedmetadata", listenToMetaData);
      audioEl.addEventListener("timeupdate", listenToTimeUpdate);
      audioEl.addEventListener("ended", listenToPlaybackEnd);
    }

    return () => {
      audioEl.removeEventListener("loadedmetadata", listenToMetaData);
      audioEl.removeEventListener("timeupdate", listenToTimeUpdate);
      audioEl.removeEventListener("ended", listenToPlaybackEnd);
    };
  }, []);

  const togglePlay = () => {
    const audioEl = audioRef.current;
    if (playState === "pause") {
      setPlayState("play");
      if (audioEl) {
        audioEl.play();
        onPlay(elRef);
      }
    } else {
      setPlayState("pause");
      if (audioEl) {
        audioEl.pause();
      }
    }
  };

  const seekToDuration = (data) => {
    if (audioRef.current && data) {
      audioRef.current.currentTime = Math.floor(data);
      setDurationData({
        totalDuration: Math.floor(audioRef.current.duration),
        currentDuration: Math.floor(data),
      });
    }
  };

  useImperativeHandle(elRef, () => ({
    stop: () => {
      setPlayState("pause");
      const audioEl = audioRef.current;
      if (audioEl) {
        seekToDuration(0);
        audioEl.pause();
      }
    },
  }));

  return (
    <MusicItemWrapper ref={drag} playState={playState}>
      <audio src={src} preload="metadata" ref={audioRef} />
      <div className="visualizer">
        <img className="thumb" src={meta?.thumbnail} alt="Sound wave"></img>
        <button className="play-pause-btn" onClick={togglePlay}>
          <FontAwesomeIcon
            icon={playState === "pause" ? faPlay : faPause}
          ></FontAwesomeIcon>
        </button>
      </div>
      <MusicPlayerSeeker
        totalDuration={totalDuration}
        currentDuration={currentDuration}
        onSeek={([d]) => {
          seekToDuration(d);
        }}
        playState={playState}
      />
      <div className="details" onClick={onClick}>
        <div className="title">{title}</div>
        <div className="duration">{durationLabel}</div>
      </div>
    </MusicItemWrapper>
  );
};

MusicItem.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    duration: PropTypes.number, // Duration in seconds
    thumbnail: PropTypes.string,
    previewUrl: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default MusicItem;
