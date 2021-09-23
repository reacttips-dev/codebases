import React from 'react';
import PropTypes from 'prop-types';
import Box from '../../../../shared/Box/index.tsx';
import AudioPlayer from '../../../../components/AudioPlayer';
import If from '../../../../shared/If/index.tsx';
import PauseButton from '../../../AdRecordingModalScreen/components/AdRecordingFlow/components/PauseButton';
import PlayButton from '../../../AdRecordingModalScreen/components/AdRecordingFlow/components/PlayButton';
import Text from '../../../../shared/Text/index.tsx';
import { msToDigital } from '../../../../utils';
import Input from '../../../../shared/Input';
import Mask from '../../../../shared/Mask';

const PreviewSection = ({
  onPlay,
  onPause,
  isPlaying,
  adAudioUrl,
  onChangeVoiceMessageTitle,
  voiceMessageTitle,
}) => (
  <Box width="100%" display="flex" justifyContent="center">
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      shape="rounded"
      maxWidth={521}
      reverseWrap
    >
      <AudioPlayer
        actions={{
          setDoSeek: isSeeking => {},
          updatePlaybackPosition: playbackPositionInSeconds => {},
        }}
        doSeek={false}
        isActive
        isPlaying={isPlaying}
        onEnded={() => {
          onPause();
        }}
        onPause={({ jumpToBeginning }) => {
          jumpToBeginning();
        }}
        onPlayOrPause={() => {}}
        url={adAudioUrl}
      />
      <Box lgWidth={50} mdWidth={50} margin="auto" isHidingAtSmScreen>
        <If
          condition={isPlaying}
          ifRender={() => (
            <PauseButton
              onClick={onPause}
              width={50}
              height={50}
              iconWidth={14}
            />
          )}
          elseRender={() => (
            <PlayButton
              iconWidth={14}
              onClick={onPlay}
              width={50}
              height={50}
            />
          )}
        />
      </Box>
      <Box
        smWidth={100}
        smHeight={100}
        margin="auto"
        isHidingAtMdScreen
        isHidingAtLgScreen
        marginTop={26}
      >
        <If
          condition={isPlaying}
          ifRender={() => (
            <PauseButton
              onClick={onPause}
              width={100}
              height={100}
              iconWidth={28}
            />
          )}
          elseRender={() => (
            <PlayButton
              onClick={onPlay}
              width={100}
              height={100}
              iconWidth={28}
            />
          )}
        />
      </Box>
      <Box
        lgWidth={437}
        mdWidth={437}
        smWidth="100%"
        marginLeft={13}
        borderWidth={2}
        borderColor="#dedfe0"
        shape="rounded"
        margin="auto"
      >
        <Mask shape="rounded" isFullWidth>
          <Input
            paddingRight={15}
            paddingLeft={15}
            paddingBottom={12}
            paddingTop={12}
            width="100%"
            onChange={onChangeVoiceMessageTitle}
            placeholder="Name your message (optional)"
            value={voiceMessageTitle}
            fontSize={18}
          />
        </Mask>
      </Box>
    </Box>
  </Box>
);

PreviewSection.propTypes = {
  adAudioUrl: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onChangeVoiceMessageTitle: PropTypes.func.isRequired,
  voiceMessageTitle: PropTypes.string.isRequired,
};

export default PreviewSection;
