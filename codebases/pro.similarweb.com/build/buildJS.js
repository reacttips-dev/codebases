import * as colorsPalettes from '../src/style-guide/colorsPalettes';
import * as colorsSets from '../src/style-guide/colorsSets';
import {rgba} from '../src/style-guide/rgba';
import {getBrightnessHEX, getBrightnessRGB} from "../src/style-guide/brightness";

// const allColors = {};
// for(let paletteKey in colorsPalettes) {
//     const palette = colorsPalettes[paletteKey];
//     palette.toArray().forEach(color => {
//         allColors[color] = getBrightnessHEX(color);
//     });
// }

export {colorsPalettes, colorsSets, rgba, getBrightnessHEX, getBrightnessRGB};