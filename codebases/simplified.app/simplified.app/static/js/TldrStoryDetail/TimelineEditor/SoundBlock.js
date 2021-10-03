import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyledSoundBlock, StyledAudioVerticalResizeHandler } from "./styled";
import { DURATION_PIXEL_RATIO } from "../../_components/styled/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SoundDropdownMenu from "./SoundDropdownMenu";

function SoundBlock({
  duration,
  title,
  parentId,
  onChangeStartEndTime,
  onChangeOffset,
  onDeleteMusic,
  onAdjustMusic,
  offset,
  start,
  end,
  scale,
}) {
  const rndRef = useRef(null);
  const [state, setstate] = useState({
    width: 0,
    offsetWidth: 0,
  });
  const { width, offsetWidth } = state;
  const maxWidth = (duration - start) * DURATION_PIXEL_RATIO * scale; // Max width would be total duration of Music

  const partialStateUpdate = (s = {}) => setstate({ ...state, ...s });

  const onDragStop = (e, data) => {
    onChangeOffset((data.x / DURATION_PIXEL_RATIO) * scale);
  };

  const onDrag = (e, data) => {
    partialStateUpdate({
      offsetWidth: data.x,
    });
  };

  const onResizeStop = (e, dir, ref, delta, pos) => {
    const endTime = start + (ref.offsetWidth / DURATION_PIXEL_RATIO) * scale;
    const newOffset = (pos.x / DURATION_PIXEL_RATIO) * scale;
    onChangeStartEndTime(start, endTime, newOffset);
    partialStateUpdate({ width: ref.offsetWidth, offsetWidth: pos.x });
  };

  const onResize = useCallback(
    (e, dir, ref, delta, pos) => {
      partialStateUpdate({
        offsetWidth: pos.x,
        width: ref.offsetWidth,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [start, offset]
  );

  useEffect(() => {
    const width = (end - start) * DURATION_PIXEL_RATIO * scale;
    const offsetWidth = offset * DURATION_PIXEL_RATIO * scale;

    partialStateUpdate({ width, offsetWidth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, start, end, scale]);

  return (
    <StyledSoundBlock
      ref={rndRef}
      default={{ x: offsetWidth, y: 0, width }}
      bounds={parentId}
      position={{ x: offsetWidth, y: 0 }}
      size={{ width: width, height: "100%" }}
      maxWidth={maxWidth}
      dragAxis="x"
      onDragStop={onDragStop}
      onDrag={onDrag}
      onResizeStop={onResizeStop}
      onResize={onResize}
      enableResizing={{
        top: false,
        bottom: false,
        left: true,
        right: true,
      }}
      resizeHandleStyles={{
        right: {
          right: "12px",
        },
        left: {
          left: "12px",
        },
      }}
      resizeHandleComponent={{
        right: (
          <OverlayTrigger
            placement="top"
            trigger={["hover", "focus"]}
            overlay={<Tooltip>Trim</Tooltip>}
          >
            <StyledAudioVerticalResizeHandler>
              <FontAwesomeIcon icon="grip-lines-vertical" />
            </StyledAudioVerticalResizeHandler>
          </OverlayTrigger>
        ),
        left: (
          <OverlayTrigger
            placement="top"
            trigger={["hover", "focus"]}
            overlay={<Tooltip>Trim</Tooltip>}
          >
            <StyledAudioVerticalResizeHandler>
              <FontAwesomeIcon icon="grip-lines-vertical" />
            </StyledAudioVerticalResizeHandler>
          </OverlayTrigger>
        ),
      }}
    >
      <div
        className="block"
        onDoubleClick={() => {
          onAdjustMusic();
        }}
      >
        <div className="music-icon">
          <FontAwesomeIcon icon={faMusic} />
        </div>
        <div className="title">
          <div>{title}</div>
        </div>
        <div className="action">
          <SoundDropdownMenu
            onDelete={onDeleteMusic}
            onAdjust={onAdjustMusic}
          />
        </div>
      </div>
    </StyledSoundBlock>
  );
}

SoundBlock.defaultProps = {
  offset: 0,
  scale: 1,
  onChangeStartEndTime: () => {},
  onChangeOffset: () => {},
};

SoundBlock.propTypes = {
  duration: PropTypes.number,
  title: PropTypes.string,
  parentId: PropTypes.string.isRequired,
  offset: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  scale: PropTypes.number,
  onChangeOffset: PropTypes.func,
  onChangeStartEndTime: PropTypes.func,
  onDeleteMusic: PropTypes.func.isRequired,
  onAdjustMusic: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SoundBlock);
