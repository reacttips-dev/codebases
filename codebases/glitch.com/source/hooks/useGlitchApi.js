import useApplication from './useApplication';
import useObservable from './useObservable';
import useGlitchApiWithToken from './useGlitchApiWithToken';

export default function useGlitchApi({
    requireToken = false
} = {}) {
    const application = useApplication();
    const user = useObservable(application.currentUser);
    const token = user ? user.persistentToken() : null;
    const glitchApi = useGlitchApiWithToken(token);
    if (requireToken && !token) {
        return null;
    }

    return glitchApi;
}