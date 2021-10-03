import React, { useContext } from "react";
import { batch, connect } from "react-redux";
import {
  StyledAddBlock,
  StyledSoundAddBlock,
  StyledTimelineContainer,
} from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Seeker from "./Seeker";
import { TimelineContext } from "../../_utils/timeline";
import { DURATION_PIXEL_RATIO } from "../../_components/styled/variable";
import ArtboardBlock from "./ArtboardBlock";
import SoundBlock from "./SoundBlock";
import Rail from "./Rail";
import { setActivePage } from "../../_actions/textToolbarActions";
import Ruler from "./Ruler";
import { wsAddPage, wsUpdateStory } from "../../_actions/webSocketAction";
import {
  openSlider,
  switchMediaTab,
} from "../../_actions/sidebarSliderActions";
import {
  MUSIC_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
} from "../../_components/details/constants";
import { openBottomPanel } from "../../_actions/bottomPanelActions";
import { BottomPanelViewTypes } from "../../_utils/constants";

export const TimelineComponent = ({
  setActivePage,
  activePage,
  wsAddPage,
  story,
  wsUpdateStory,
  switchMediaTab,
  openSlider,
  openBottomPanel,
}) => {
  const {
    duration,
    pagesData,
    audioData,
    currentTime,
    seek,
    updateStoryAudioState,
    timescale,
  } = useContext(TimelineContext);
  let railLength = 0;

  railLength = currentTime * DURATION_PIXEL_RATIO * timescale;

  // On change the position of the seeker
  const onChangePosition = (e, d) => {
    const seekDurationInSeconds = d.x / (DURATION_PIXEL_RATIO * timescale);
    seek(seekDurationInSeconds);
  };

  // On click artboard block
  const switchArtboardOnClick = (pageId, pageIdx) => {
    setActivePage(pageId, pageIdx, true);
  };

  // Callback on addArtboad
  const addArtboard = () => {
    wsAddPage();
  };

  // Callback on clicking add music
  const addMusic = () => {
    batch(() => {
      openSlider(VIDEO_SLIDER_PANEL);
      switchMediaTab(MUSIC_SLIDER_PANEL);
    });
  };

  // When Story music is Dragged
  const onSubmitStoryMusicOffset = (newOffset) => {
    const musicData = story?.payload?.payload?.music;
    if (!musicData) return;

    updateStoryAudioState({ offset: newOffset });

    wsUpdateStory({
      music: { ...musicData, offset: newOffset, action: "change_music_offset" },
    });
  };

  // When story music is trimmed
  const onSubmitStoryMusicTrim = (startTime, endTime, offset) => {
    const musicData = story?.payload?.payload?.music;
    if (!musicData) return;
    updateStoryAudioState({
      start: startTime,
      end: endTime,
      offset,
      action: "trim",
    });
    wsUpdateStory({
      music: {
        ...musicData,
        start: startTime,
        end: endTime,
        offset,
        action: "trim",
      },
    });
  };

  // On delete music
  const onDeleteMusic = () => {
    wsUpdateStory({
      music: {
        action: "delete",
      },
    });
  };

  // On adjust music open expanded view
  const onAdjustMusic = () => {
    openBottomPanel(BottomPanelViewTypes.TRIM_STORY_MUSIC);
  };

  return (
    <StyledTimelineContainer>
      <div className="pl-3">
        <div
          id="seeker-track"
          style={{ width: DURATION_PIXEL_RATIO * timescale * duration }}
        >
          <Seeker
            pos={railLength}
            parentId="#seeker-track"
            onChangePosition={onChangePosition}
          ></Seeker>
        </div>
        <Ruler duration={duration} scale={timescale} onSeek={seek} />

        <Rail
          id="video-rail"
          addComponent={
            <div
              className="align-self-stretch px-2"
              style={{ width: `${DURATION_PIXEL_RATIO * timescale * 6}px` }}
            >
              <StyledAddBlock onClick={addArtboard}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </StyledAddBlock>
            </div>
          }
          width={duration * DURATION_PIXEL_RATIO * timescale}
        >
          {pagesData.map((page, idx) => (
            <ArtboardBlock
              page={page}
              key={page.id}
              order={idx}
              start={page.startTime}
              end={page.endTime}
              isActive={activePage.id === page.id}
              id={page.id}
              scale={timescale}
              onClick={() => {
                switchArtboardOnClick(page.id, idx);
                seek(page.startTime);
              }}
            />
          ))}
        </Rail>
        <Rail
          id="audio-rail"
          height="48px"
          width={duration * DURATION_PIXEL_RATIO * timescale}
        >
          {audioData ? (
            <SoundBlock
              parentId="#audio-rail"
              duration={audioData.duration}
              offset={audioData.offset}
              title={audioData.title}
              start={audioData.start}
              end={audioData.end}
              onChangeOffset={onSubmitStoryMusicOffset}
              onChangeStartEndTime={onSubmitStoryMusicTrim}
              onDeleteMusic={onDeleteMusic}
              onAdjustMusic={onAdjustMusic}
              scale={timescale}
            ></SoundBlock>
          ) : (
            <div className="align-self-stretch px-2" style={{ width: "100%" }}>
              <StyledSoundAddBlock onClick={addMusic}>
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faPlus}
                ></FontAwesomeIcon>
                Add Music
              </StyledSoundAddBlock>
            </div>
          )}
        </Rail>
      </div>
    </StyledTimelineContainer>
  );
};

TimelineComponent.propTypes = {};

const mapStateToProps = (state) => ({
  activePage: state.editor.activePage,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, pageIdx, isSelected) =>
    dispatch(setActivePage(pageId, pageIdx, isSelected)),
  wsAddPage: () => dispatch(wsAddPage()),
  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
  switchMediaTab: (tab) => dispatch(switchMediaTab(tab)),
  openSlider: (panelType) => dispatch(openSlider(panelType)),
  openBottomPanel: (panelType) => dispatch(openBottomPanel(panelType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineComponent);
