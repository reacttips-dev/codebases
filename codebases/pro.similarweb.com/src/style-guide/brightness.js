import {hexToRgb} from "./rgba";

const BRIGHTNESS_TRESHOLD = 200;

// https://www.w3.org/TR/AERT/#color-contrast
const calculateBrightness = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
}

export const getBrightnessRGB = (r, g, b) => {
    const brightness = calculateBrightness(r, g, b);
    if (brightness > BRIGHTNESS_TRESHOLD) {
        return 'light';
    } else {
        return 'dark';
    }
}

export const getBrightnessHEX = (hex) => {
    const rgb = hexToRgb(hex);
    return rgb ? getBrightnessRGB(rgb.r, rgb.g, rgb.b) : 'dark';
}