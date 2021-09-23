import { css } from 'emotion';
import React from 'react';

import { AddMusicIcon } from './components/AddMusicIcon';
import { AnchorAppIcon } from './components/AnchorAppIcon';
import { AnchorLogoIcon } from './components/AnchorLogoIcon';
import AnchorPayIcon from './components/AnchorPayIcon';
import { AppleAppStoreBadgeIcon } from './components/AppleAppStoreBadgeIcon';
import AppleLogoIcon from './components/AppleLogoIcon';
import ArrowIcon from './components/ArrowIcon';
import { CalendarIcon } from './components/CalendarIcon';
import { CarrotIcon } from './components/CarrotIcon';
import CheckmarkIcon from './components/CheckmarkIcon';
import CircularArrowIcon from './components/CircularArrowIcon';
import { ClockIcon } from './components/ClockIcon';
import DistributionNetworkIcon from './components/DistributionNetworkIcon';
import DollarSignIcon from './components/DollarSignIcon';
import { DownloadIcon } from './components/DownloadIcon';
import { EditMusicIcon } from './components/EditMusicIcon';
import { EmailVerified } from './components/EmailVerified';
import { EmbedIcon } from './components/EmbedIcon';
import { EpisodeDetailsIcon } from './components/EpisodeDetailsIcon';
import { EpisodeFailedToLoadIcon } from './components/EpisodeFailedToLoadIcon';
import EpisodeIcon from './components/EpisodeIcon';
import { ErrorIcon } from './components/ErrorIcon';
import ExternalLinkIcon from './components/ExternalLinkIcon';
import EyeDropperIcon from './components/EyeDropperIcon';
import { FacebookLogoIcon } from './components/FacebookLogoIcon';
import { FacebookLogoSimpleIcon } from './components/FacebookLogoSimpleIcon';
import { GearIcon } from './components/GearIcon';
import { GlobeIcon } from './components/GlobeIcon';
import { GoogleAppStoreBadgeIcon } from './components/GoogleAppStoreBadgeIcon';
import GooglePlayLogoIcon from './components/GooglePlayLogoIcon';
import { HeadphonesIcon } from './components/HeadphonesIcon';
import { HourglassIcon } from './components/HourglassIcon';
import { InstagramIcon } from './components/InstagramIcon';
import JustifiedIcon from './components/JustifiedIcon';
import { LaptopIcon } from './components/LaptopIcon';
import { LinkIcon } from './components/LinkIcon';
import { LockIcon } from './components/LockIcon';
import MagnifyingGlassIcon from './components/MagnifyingGlassIcon';
import MicrophoneIcon from './components/MicrophoneIcon';
import { OptionDotsIcon } from './components/OptionDotsIcon';
import { PauseIcon } from './components/PauseIcon';
import { PencilIcon } from './components/PencilIcon';
import { PhoneIcon } from './components/PhoneIcon';
import PlayIcon from './components/PlayIcon';
import PodcastIcon from './components/PodcastIcon';
import { PowerIcon } from './components/PowerIcon';
import QuestionMarkIcon from './components/QuestionMarkIcon';
import QuoteIcon from './components/QuoteIcon';
import RedirectionIcon from './components/RedirectionIcon';
import { RemoveMusicIcon } from './components/RemoveMusicIcon';
import ReRecordIcon from './components/ReRecordIcon';
import { RetryIcon } from './components/RetryIcon';
import { SafariArrow } from './components/SafariArrow';
import { SpeakerIcon } from './components/SpeakerIcon';
import { SpinnerIcon } from './components/SpinnerIcon';
import { SplittingIcon } from './components/SplittingIcon';
import { StopIcon } from './components/StopIcon';
import { ThreePeople } from './components/ThreePeople';
import { TrashIcon } from './components/TrashIcon';
import { TwitterLogoIcon } from './components/TwitterLogoIcon';
import { UpsidedownTriangleIcon } from './components/UpsidedownTriangleIcon';
import UpwardTrendingGraphIcon from './components/UpwardTrendingGraphIcon';
import { VideoPlayerIcon } from './components/VideoPlayerIcon';
import { VoiceMessageIcon } from './components/VoiceMessageIcon';
import { VolumeOffIcon } from './components/VolumeOffIcon';
import { VolumeOnIcon } from './components/VolumeOnIcon';
import { WalletIcon } from './components/WalletIcon';
import XIcon from './components/XIcon';
import { YoutubeIcon } from './components/YoutubeIcon';
import { SyncIcon } from './components/SyncIcon';
import { WordPressIcon } from './components/WordPressIcon';
import { IconProps, IconType } from './types/index.d';
import { OutlinedMusicNote } from '../../components/svgs/OutlinedMusicNote';
import { OutlinedLock } from '../../components/svgs/OutlinedLock';
import { ExclamationCircle } from './components/ExclamationCircle';

// To change the size of the icon: change the width of the container element.
const renderIconForType = (
  type: IconType,
  svgClassName: string,
  fillColor: string,
  isInCircle: boolean,
  circleColor: string
): React.ReactNode => {
  switch (type) {
    case 'AnchorAppIcon':
      return <AnchorAppIcon className={svgClassName} />;
    case 'AppleAppStoreBadgeIcon':
      return (
        <AppleAppStoreBadgeIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'GoogleAppStoreBadgeIcon':
      return (
        <GoogleAppStoreBadgeIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'Carrot':
      return <CarrotIcon className={svgClassName} fillColor={fillColor} />;
    case 'AddMusic':
      return <AddMusicIcon className={svgClassName} fillColor={fillColor} />;
    case 'EditMusic':
      return <EditMusicIcon className={svgClassName} fillColor={fillColor} />;
    case 'VolumeOff':
      return <VolumeOffIcon className={svgClassName} fillColor={fillColor} />;
    case 'VolumeOn':
      return <VolumeOnIcon className={svgClassName} fillColor={fillColor} />;
    case 'Retry':
      return <RetryIcon className={svgClassName} fillColor={fillColor} />;
    case 'RemoveMusic':
      return <RemoveMusicIcon className={svgClassName} fillColor={fillColor} />;
    case 'Stop':
      return <StopIcon className={svgClassName} fillColor={fillColor} />;
    case 'SpeakerOn':
      return (
        <SpeakerIcon
          isOn={true}
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'SpeakerOff':
      return (
        <SpeakerIcon
          isOn={false}
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'SpinnerIcon':
      return <SpinnerIcon className={svgClassName} fillColor={fillColor} />;
    case 'Pencil':
      return <PencilIcon className={svgClassName} fillColor={fillColor} />;
    case 'PhoneIcon':
      return <PhoneIcon className={svgClassName} fillColor={fillColor} />;
    case 'TwitterLogo':
      return <TwitterLogoIcon className={svgClassName} fillColor={fillColor} />;
    case 'FacebookLogo':
      return (
        <FacebookLogoIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'FacebookLogoSimple':
      return (
        <FacebookLogoSimpleIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'Embed':
      return <EmbedIcon className={svgClassName} fillColor={fillColor} />;
    case 'gear':
      return <GearIcon className={svgClassName} fillColor={fillColor} />;
    case 'power':
      return <PowerIcon className={svgClassName} fillColor={fillColor} />;
    case 'clock':
      return (
        <ClockIcon
          isInCircle={isInCircle}
          circleColor={circleColor}
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'lock':
      return (
        <LockIcon
          isInCircle={isInCircle}
          circleColor={circleColor}
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'redirection':
      return <RedirectionIcon className={svgClassName} fillColor={fillColor} />;
    case 'distributionNetwork':
      return (
        <DistributionNetworkIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'episode':
      return <EpisodeIcon className={svgClassName} fillColor={fillColor} />;
    case 'EpisodeFailedToLoad':
      return (
        <EpisodeFailedToLoadIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'EpisodeDetails':
      return (
        <EpisodeDetailsIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'Error':
      return <ErrorIcon className={svgClassName} fillColor={fillColor} />;
    case 'Globe':
      return <GlobeIcon className={svgClassName} fillColor={fillColor} />;
    case 'headphones':
      return <HeadphonesIcon className={svgClassName} fillColor={fillColor} />;
    case 'upwardTrendingGraph':
      return (
        <UpwardTrendingGraphIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'podcast':
      return <PodcastIcon className={svgClassName} fillColor={fillColor} />;
    case 'apple_logo':
      return <AppleLogoIcon className={svgClassName} fillColor={fillColor} />;
    case 'google_play_logo':
      return (
        <GooglePlayLogoIcon className={svgClassName} fillColor={fillColor} />
      );
    case 're_record':
      return <ReRecordIcon className={svgClassName} fillColor={fillColor} />;
    case 'trash':
      return <TrashIcon className={svgClassName} fillColor={fillColor} />;
    case 'ThreePeople':
      return <ThreePeople className={svgClassName} fillColor={fillColor} />;
    case 'circular_arrow':
      return (
        <CircularArrowIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'question_mark':
      return (
        <QuestionMarkIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'dollar_sign':
      return (
        <DollarSignIcon
          className={svgClassName}
          fillColor={fillColor}
          isInCircle={isInCircle}
          circleColor={circleColor}
        />
      );
    case 'option_dots':
      return <OptionDotsIcon className={svgClassName} fillColor={fillColor} />;
    case 'microphone':
      return <MicrophoneIcon className={svgClassName} fillColor={fillColor} />;
    case 'anchor_pay':
      return <AnchorPayIcon className={svgClassName} fillColor={fillColor} />;
    case 'external_link':
      return (
        <ExternalLinkIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'play':
      return <PlayIcon className={svgClassName} fillColor={fillColor} />;
    case 'upsidedown_triangle':
      return (
        <UpsidedownTriangleIcon
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'quote':
      return <QuoteIcon className={svgClassName} fillColor={fillColor} />;
    case 'pause':
      return <PauseIcon className={svgClassName} fillColor={fillColor} />;
    case 'download':
      return <DownloadIcon className={svgClassName} fillColor={fillColor} />;
    case 'x':
      return <XIcon className={svgClassName} fillColor={fillColor} />;
    case 'SafariArrow':
      return <SafariArrow className={svgClassName} fillColor={fillColor} />;
    case 'checkmark':
      return <CheckmarkIcon className={svgClassName} fillColor={fillColor} />;
    case 'anchor_logo':
      return <AnchorLogoIcon className={svgClassName} fillColor={fillColor} />;
    case 'eye_dropper':
      return <EyeDropperIcon className={svgClassName} fillColor={fillColor} />;
    case 'left_arrow':
      return (
        <ArrowIcon
          className={svgClassName}
          direction="left"
          fillColor={fillColor}
        />
      );
    case 'magnifying_glass':
      return (
        <MagnifyingGlassIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'justified_center':
      return (
        <JustifiedIcon
          type="center"
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'justified_left':
      return (
        <JustifiedIcon
          type="left"
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'justified_right':
      return (
        <JustifiedIcon
          type="right"
          className={svgClassName}
          fillColor={fillColor}
        />
      );
    case 'LaptopIcon':
      return <LaptopIcon className={svgClassName} fillColor={fillColor} />;
    case 'link':
      return <LinkIcon className={svgClassName} fillColor={fillColor} />;
    case 'Wallet':
      return <WalletIcon className={svgClassName} fillColor={fillColor} />;
    case 'videoPlayer':
      return <VideoPlayerIcon className={svgClassName} fillColor={fillColor} />;
    case 'voice_message':
      return (
        <VoiceMessageIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'Splitting':
      return <SplittingIcon className={svgClassName} fillColor={fillColor} />;
    case 'Calendar':
      return <CalendarIcon className={svgClassName} fillColor={fillColor} />;
    case 'EmailVerified':
      return <EmailVerified className={svgClassName} />;
    case 'Instagram':
      return <InstagramIcon className={svgClassName} fillColor={fillColor} />;
    case 'Youtube':
      return <YoutubeIcon className={svgClassName} fillColor={fillColor} />;
    case 'hourglass':
      return <HourglassIcon className={svgClassName} fillColor={fillColor} />;
    case 'OutlinedMusicNote':
      return (
        <OutlinedMusicNote className={svgClassName} fillColor={fillColor} />
      );
    case 'OutlinedLock':
      return <OutlinedLock className={svgClassName} fillColor={fillColor} />;
    case 'Sync':
      return <SyncIcon className={svgClassName} fillColor={fillColor} />;
    case 'WordPress':
      return <WordPressIcon className={svgClassName} fillColor={fillColor} />;
    case 'ExclamationCircle':
      return (
        <ExclamationCircle className={svgClassName} fillColor={fillColor} />
      );
    case 'none':
      return null;
    default:
      const exhaustiveCheck: never = type;
      return exhaustiveCheck;
  }
};

const containerClassName = css({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const svgClassName = css({
  display: 'block',
  margin: 'auto',
  width: '100%',
});

const defaultProps = {
  fillColor: '#53585E',
  isInCircle: false,
  circleColor: 'black',
  ariaHidden: true,
};

const Icon = ({
  type,
  fillColor,
  isInCircle,
  circleColor,
  ariaHidden,
}: IconProps): React.ReactElement<React.ReactNode> => (
  <div className={containerClassName} aria-hidden={ariaHidden}>
    {renderIconForType(type, svgClassName, fillColor, isInCircle, circleColor)}
  </div>
);

Icon.defaultProps = defaultProps;

export { Icon as default, Icon };
