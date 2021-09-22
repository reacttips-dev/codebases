import getPaletteAsRawColors from '../selectors/getPaletteAsRawColors';
import getFallbackPaletteAsRawColors from '../selectors/getFallbackPaletteAsRawColors';

export default function setCssVariablesOnDocument() {
    // Even if a browser doesn't support CSS variables, setting these values is benign
    const palette = getPaletteAsRawColors();
    const fallbackPalette = getFallbackPaletteAsRawColors();

    Object.keys(palette).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, palette[key]!);
    });

    Object.keys(fallbackPalette).forEach(key => {
        document.documentElement.style.setProperty(`--fallback-${key}`, fallbackPalette[key]!);
    });
}
