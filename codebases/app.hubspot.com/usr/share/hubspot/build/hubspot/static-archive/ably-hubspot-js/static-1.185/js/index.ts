import * as Ably from 'ably';
import { enforceDefaultClientOptions } from './enforceDefaultClientOptions';
var HubSpotAbly = {
  Rest: Ably.Rest,
  msgpack: Ably.msgpack,
  Realtime: enforceDefaultClientOptions(Ably.Realtime)
};
export default HubSpotAbly;