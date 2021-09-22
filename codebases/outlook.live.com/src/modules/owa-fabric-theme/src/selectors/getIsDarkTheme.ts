import store from '../store/store';

export default function getIsDarkTheme(): boolean {
    return store().isInverted;
}
