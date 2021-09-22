import { BootstrapStatus } from '../store/schema/YammerBootstrapStore';
import store from '../store/store';

export default function isYammerReady(): boolean {
    return store.bootstrapStatus == BootstrapStatus.Completed;
}
