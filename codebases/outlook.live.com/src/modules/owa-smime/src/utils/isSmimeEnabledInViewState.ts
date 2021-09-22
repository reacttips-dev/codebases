import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';

const isSmimeEnabledInViewState = (smimeViewState: SmimeViewState): boolean => {
    if (smimeViewState) {
        const { shouldEncryptMessageAsSmime, shouldSignMessageAsSmime } = smimeViewState;
        return shouldEncryptMessageAsSmime || shouldSignMessageAsSmime;
    } else {
        return false;
    }
};

export default isSmimeEnabledInViewState;
