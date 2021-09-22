import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function shouldAlwaysShowBcc(): boolean {
    const userOptions = getUserConfiguration().UserOptions;
    return userOptions.AlwaysShowBcc;
}
