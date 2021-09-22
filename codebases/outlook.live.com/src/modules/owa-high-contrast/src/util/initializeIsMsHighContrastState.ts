import { getStore } from '../store/store';
import { MsHighContrastMode } from '../store/schema/MsHighContrastMode';
import setMsHighContrastMode from '../mutators/setMsHighContrastMode';

export default function initializeIsMsHighContrastState() {
    const mediaQuery = window.matchMedia('screen and (-ms-high-contrast: active)');
    mediaQuery.addListener(handleHighContrastActiveChange);
    handleHighContrastActiveChange(mediaQuery);

    const mediaQueryHcWhiteOnBlack = window.matchMedia(
        'screen and (-ms-high-contrast: white-on-black)'
    );
    mediaQueryHcWhiteOnBlack.addListener(handleHighContrastWhiteOnBlackChange);
    handleHighContrastWhiteOnBlackChange(mediaQueryHcWhiteOnBlack);

    const mediaQueryHcBlackOnWhite = window.matchMedia(
        'screen and (-ms-high-contrast: black-on-white)'
    );
    mediaQueryHcBlackOnWhite.addListener(handleHighContrastBlackOnWhiteChange);
    handleHighContrastBlackOnWhiteChange(mediaQueryHcBlackOnWhite);
}

// media query change
function handleHighContrastActiveChange(mediaQuery) {
    // toggle store value if media query match is different than current state
    if (!mediaQuery.matches && getStore().mode !== MsHighContrastMode.None) {
        setMsHighContrastMode(MsHighContrastMode.None);
    }
}

function handleHighContrastWhiteOnBlackChange(mediaQuery) {
    // toggle store value if media query match is different than current state
    if (mediaQuery.matches && getStore().mode !== MsHighContrastMode.HighContrastWhiteOnBlack) {
        setMsHighContrastMode(MsHighContrastMode.HighContrastWhiteOnBlack);
    }
}

function handleHighContrastBlackOnWhiteChange(mediaQuery) {
    // toggle store value if media query match is different than current state
    if (mediaQuery.matches && getStore().mode !== MsHighContrastMode.HighContrastBlackOnWhite) {
        setMsHighContrastMode(MsHighContrastMode.HighContrastBlackOnWhite);
    }
}
