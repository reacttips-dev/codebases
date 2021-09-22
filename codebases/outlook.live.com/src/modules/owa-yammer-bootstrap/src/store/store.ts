import { createStore } from 'satcheljs';
import YammerBootstrapStore, { BootstrapStatus } from './schema/YammerBootstrapStore';

export default createStore<YammerBootstrapStore>('yammerBoostrapStore', {
    bootstrapStatus: BootstrapStatus.NotStarted,
})();
