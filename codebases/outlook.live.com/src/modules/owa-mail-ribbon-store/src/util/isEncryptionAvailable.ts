import isEncryptionEnabled from 'owa-encryption-common/lib/utils/isEncryptionEnabled';
import isEncryptionTemplateAvailable from 'owa-mail-compose-view/lib/utils/isEncryptionTemplateAvailable';

export const isEncryptionAvailable = (): boolean => {
    return (isEncryptionEnabled() && isEncryptionTemplateAvailable()) ?? false;
};
