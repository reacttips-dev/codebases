import type { MessageExtensionConfig } from './schema/MessageExtensionConfig';

// Using global variable for storing details as we are not doing any re-rendering
const messageExtensionConfig: MessageExtensionConfig = {
    isDeveloperLicense: false,
};

export default messageExtensionConfig;
