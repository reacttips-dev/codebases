import { getExtensibilityState, isExtensibilityContextInitialized } from 'owa-addins-store';
import { when } from 'mobx';

const EXTENSIBILITY_CONTEXT_MAX_RETRY_INTERVAL: number = 3000;
const EXTENSIBILITY_CONTEXT_MAX_RETRY_COUNT: number = 3;

let whenExtensibilityIsAvailable = async () => {
    const context = getExtensibilityState().Context;
    const addinsInitialized = isExtensibilityContextInitialized();

    if (addinsInitialized && context) {
        return true;
    } else {
        const options = {
            name: 'Extensibility initialization observer timeout',
            timeout:
                EXTENSIBILITY_CONTEXT_MAX_RETRY_INTERVAL * EXTENSIBILITY_CONTEXT_MAX_RETRY_COUNT,
        };
        try {
            await when(
                () => getExtensibilityState().Context && isExtensibilityContextInitialized(),
                options
            );
        } catch (e) {
            //in-case of timeout return false
            return false;
        }
    }
    return getExtensibilityState().Context && isExtensibilityContextInitialized();
};

export default whenExtensibilityIsAvailable;
