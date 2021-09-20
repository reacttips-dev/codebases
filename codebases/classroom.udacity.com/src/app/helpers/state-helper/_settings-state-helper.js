import SettingsHelper from 'helpers/settings-helper';

export function isForumEnabled(state) {
    return (
        _.has(state, 'settings.user') && !SettingsHelper.State.isGTStudent(state)
    );
}