import {
    useMemo
} from 'react';
import GlitchApi from '../glitch-api';

export default function useGlitchApiWithToken(token) {
    return useMemo(() => new GlitchApi(token), [token]);
}