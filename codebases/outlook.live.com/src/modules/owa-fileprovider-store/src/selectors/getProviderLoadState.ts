import getStore from '../store/store';
import type { ProviderLoadStateOption } from '../store/schema/ProviderLoadStateOption';

function getProviderLoadState(): ProviderLoadStateOption {
    return getStore().loadState;
}

export { getProviderLoadState };
