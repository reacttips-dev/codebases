/**
 * PlaybackButtons
 *
 * Note:
 * Use this in context of TimelineProvider only
 */

import React, { useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  StyledPlaybackActionButton,
  StyledPlaybackWrapper,
  StyledPlayButton,
} from "./styled";
import { TimelineContext } from "../../_utils/timeline";
import { connect } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

dayjs.extend(duration);

function PlaybackButtons(props) {
  const { isPlaying, play, pause, seek, currentTime, seekRelative } =
    useContext(TimelineContext);

  // Optimized playback
  return useMemo(() => {
    return (
      <StyledPlaybackWrapper data-click>
        <OverlayTrigger
          placement="top"
          trigger={["hover", "focus"]}
          overlay={<Tooltip>Backward 3 seconds</Tooltip>}
        >
          <StyledPlaybackActionButton
            className="mr-3 d-none d-md-flex"
            onClick={() => {
              seekRelative(-3);
            }}
          >
            <FontAwesomeIcon icon={faBackward} />
          </StyledPlaybackActionButton>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          trigger={["hover", "focus"]}
          overlay={<Tooltip>{isPlaying ? "Pause" : "Play"}</Tooltip>}
        >
          <StyledPlayButton
            className="mx-3"
            onClick={isPlaying ? () => pause() : () => play()}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </StyledPlayButton>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          trigger={["hover", "focus"]}
          overlay={<Tooltip>Forward 3 Seconds</Tooltip>}
        >
          <StyledPlaybackActionButton
            className="ml-3 d-none d-md-flex"
            onClick={() => {
              seekRelative(3);
            }}
          >
            <FontAwesomeIcon icon={faForward} />
          </StyledPlaybackActionButton>
        </OverlayTrigger>
      </StyledPlaybackWrapper>
    );
  }, [isPlaying, play, pause, seekRelative]);
}

PlaybackButtons.propTypes = {};

const mapStateToProps = (state) => ({
  motionStore: state.motionStore,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackButtons);
