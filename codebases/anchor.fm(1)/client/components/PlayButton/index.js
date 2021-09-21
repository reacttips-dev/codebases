/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import CircleButton from '../CircleButton';
import styles from './styles.sass';
import { PauseIcon } from '../../shared/Icon/components/PauseIcon';
import { StopButton } from '../../screens/EpisodeEditorScreen/styles';
import { musicSegmentBackground } from '../../screens/EpisodeEditorScreen/components/EpisodeCreationMusic/styles';

const PlayButton = ({
  albumImageUrl = null,
  colors: { colorClass },
  className = '',
  disabled,
  iconColors: { color: iconColor },
  isPlaying,
  onClick,
  size = 36,
  iconSize = 18,
  ariaLabel = '',
  shouldShowStopButtonInsteadOfPause = false,
}) => {
  function renderPlayButtonContent() {
    if (isPlaying) {
      return shouldShowStopButtonInsteadOfPause ? (
        <StopButton iconSize={iconSize} />
      ) : (
        <PauseIcon fillColor={iconColor} iconSize={iconSize} />
      );
    }
    return <PlayIcon iconSize={iconSize} fillColor={iconColor} />;
  }

  return (
    <CircleButton
      baseColor={colorClass}
      onClick={onClick}
      size={size}
      disabled={disabled}
      className={`${styles.playButton} ${className}`}
      ariaLabel={ariaLabel}
      css={albumImageUrl ? musicSegmentBackground(albumImageUrl) : null}
    >
      {/* Pause and Plus SVGs */}
      {renderPlayButtonContent()}
    </CircleButton>
  );
};

PlayButton.defaultProps = {
  colors: { colorClass: 'gray' },
  iconColors: { color: '#fff' },
  className: '',
  disabled: false,
  isPlaying: false,
  size: 36,
  iconSize: 18,
  ariaLabel: '',
};

PlayButton.propTypes = {
  colors: PropTypes.shape({
    color: PropTypes.string,
    colorClass: PropTypes.string,
    colorDark: PropTypes.string,
    colorLight: PropTypes.string,
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  iconColors: PropTypes.shape({
    color: PropTypes.string,
    colorClass: PropTypes.string,
    colorDark: PropTypes.string,
    colorLight: PropTypes.string,
  }),
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.number,
  iconSize: PropTypes.number,
  ariaLabel: PropTypes.string,
};

export default PlayButton;

export const PlayIcon = ({ iconSize, fillColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 0 11 12"
    width={iconSize}
    height={iconSize}
    aria-label="play icon"
    aria-hidden="true"
  >
    <rect width="12" height="12" fill="none" />
    <path
      d="M1 .81v10.38a.76.76 0 0 0 .75.75.67.67 0 0 0 .39-.12l8.42-5.18a.75.75 0 0 0 0-1.28L2.14.18a.75.75 0 0 0-1 .24.79.79 0 0 0-.14.39z"
      fill={fillColor}
    />
  </svg>
);
