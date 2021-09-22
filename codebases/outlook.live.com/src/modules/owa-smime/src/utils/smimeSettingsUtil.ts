import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getSmimeAdminSettings from 'owa-session-store/lib/utils/getSmimeAdminSettings';

export const isSmimeAdminSettingEnabled = (): boolean => {
    const smimeSettings = getSmimeAdminSettings();
    return smimeSettings && (smimeSettings.AlwaysEncrypt || smimeSettings.AlwaysSign);
};

export const isSmimeUserSettingEnabled = (): boolean => {
    const userConfig = getUserConfiguration();
    return (
        userConfig?.UserOptions &&
        (userConfig.UserOptions.SmimeEncrypt || userConfig.UserOptions.SmimeSign)
    );
};

export const isSmimeSettingEnabled = (): boolean => {
    return isSmimeUserSettingEnabled() || isSmimeAdminSettingEnabled();
};
