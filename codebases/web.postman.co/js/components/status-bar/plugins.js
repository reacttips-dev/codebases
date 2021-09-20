import Help from './Help';
import BootcampLauncher from '../../../onboarding/src/features/Skills/Bootcamp/components/BootcampLauncher';
import AgentSelection from './AgentSelection';
import BrowserActiveTrackSelection from './BrowserActiveTrackSelection';
import WebSocketProxySelection from './WebSocketProxySelection';
import { TRACK_SUPPORTED_CHANNELS } from '../../constants/TrackSupportConstants';
import Trash from './Trash';
import Runner from './Runner';
import TwoPane from './TwoPane';
import Copyright from './Copyright';

let pluginsToAdd = [
  Help,
  TwoPane,
  Trash,
  Runner,
  AgentSelection,
  BootcampLauncher,
  Copyright
];

if (window.SDK_PLATFORM === 'browser' && TRACK_SUPPORTED_CHANNELS.has(window.RELEASE_CHANNEL)) {
  pluginsToAdd.push(BrowserActiveTrackSelection);
  pluginsToAdd.push(WebSocketProxySelection);
}

export default pluginsToAdd;
