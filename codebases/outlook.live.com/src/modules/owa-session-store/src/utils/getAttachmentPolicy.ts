import getUserConfigurationForUser from '../selectors/getUserConfigurationForUser';

export default function getAttachmentPolicy(userIdentity?: string | undefined) {
    return getUserConfigurationForUser(userIdentity)?.AttachmentPolicy;
}
