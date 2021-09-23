import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../../../../shared/Box/index.tsx';
import { ButtonWithHoverAndPress } from '../../../../shared/Button';
import Heading from '../../../../shared/Heading/index.tsx';
import Text from '../../../../shared/Text/index.tsx';
import { msToDigital } from '../../../../utils';

class IntervalSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalSwitch: false,
    };
    this.interval = null;
  }

  componentDidMount() {
    const { intervalInMs } = this.props;
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        intervalSwitch: !prevState.intervalSwitch,
      }));
    }, intervalInMs);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { children } = this.props;
    const { intervalSwitch } = this.state;
    return children({ intervalSwitch });
  }
}

const CurrentlyRecordingSection = ({
  stopRecording,
  recordingDurationInMs,
  warningColorAfterMs,
  isLoading,
}) => (
  <Box
    testId="AdRecordingFlow_currently-recording-content"
    width="100%"
    height="100%"
    display="flex"
    direction="column"
    justifyContent="between"
  >
    <Box>
      <Box>
        <Box display="flex" justifyContent="center">
          <Box display="flex" alignItems="center">
            <IntervalSwitch intervalInMs={1000}>
              {({ intervalSwitch }) => (
                <Box
                  height={10}
                  width={10}
                  color={intervalSwitch ? '#fd6767' : 'transparent'}
                  shape="circle"
                  marginRight={5}
                />
              )}
            </IntervalSwitch>
            <Heading
              dangerouslySetFontSize={21}
              size="sm"
              align="center"
              color="#292f36"
              isBold
            >
              You're recording right now
            </Heading>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text
          sizeAtSmScreen="lg"
          sizeAtMdScreen="xl"
          sizeAtLgScreen="xl"
          align="center"
          color="#7f8287"
          maxVisibleLines={2}
        >
          You can record for up to 1 minute.
        </Text>
      </Box>
    </Box>
    <Box>
      <Timer
        style={{
          color: recordingDurationInMs > warningColorAfterMs ? 'red' : 'black',
        }}
      >
        {msToDigital(recordingDurationInMs)}
      </Timer>
    </Box>
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        isHidingAtMdScreen
        isHidingAtLgScreen
        marginBottom={16}
      >
        <Box>
          <Text
            sizeAtSmScreen="lg"
            sizeAtMdScreen="xl"
            sizeAtLgScreen="xl"
            color="#929599"
            align="center"
          >
            Tip: Hold the mic close to your mouth for the clearest recording
          </Text>
        </Box>
      </Box>
      <Box width="100%" display="flex" justifyContent="center">
        <Box width="100%" maxWidth={300}>
          <ButtonWithHoverAndPress
            isDisabled={isLoading}
            shape="pill"
            isProcessing={isLoading}
            type="unelevated"
            colorTheme="black"
            text="Stop recording"
            size="sm"
            isFullWidth
            onPress={stopRecording}
          />
        </Box>
      </Box>
    </Box>
  </Box>
);

const Timer = styled.div`
  font-family: MaaxMono, Maax, monospace;
  font-size: 6rem;
  font-weight: bold;
  text-align: center;
`;

CurrentlyRecordingSection.propTypes = {
  recordingDurationInMs: PropTypes.number.isRequired,
  stopRecording: PropTypes.func.isRequired,
  warningColorAfterMs: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CurrentlyRecordingSection;
