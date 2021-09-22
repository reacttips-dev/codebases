import { multiply } from "color-blend/unit";

export class colorsUtilities {
    private static COLOR_HEX_PREFIX = "#";
    private static HEX_BASE = 16;

    static hexToRgba = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            r: colorsUtilities.componentToDecimal(result[1]),
            g: colorsUtilities.componentToDecimal(result[2]),
            b: colorsUtilities.componentToDecimal(result[3]),
            a: 1,
        };
    };

    // format the rgb vector into 0 to 1 scale
    static normalRgbaVector = (rgbaVector) => ({
        ...rgbaVector,
        r: rgbaVector.r / 255,
        g: rgbaVector.g / 255,
        b: rgbaVector.b / 255,
    });

    private static componentToDecimal = (colorComponent) =>
        parseInt(colorComponent, colorsUtilities.HEX_BASE);

    // converts decimal to hex
    private static componentToHex = (colorComponent) => {
        const colorHex = (colorComponent * 255).toString(16);
        // colorHex.length == 1 is equivalent to check if the colorComponent number is smaller then 16
        return colorHex.length == 1 ? "0" + colorHex : colorHex;
    };

    static rgbaToHex = (rgb) => {
        const { r, g, b } = rgb;
        return (
            colorsUtilities.COLOR_HEX_PREFIX +
            colorsUtilities.componentToHex(r) +
            colorsUtilities.componentToHex(g) +
            colorsUtilities.componentToHex(b)
        );
    };

    static multiplyColors = (colorA, colorB) => multiply(colorA, colorB);

    static multiplyHexColors = (colorA, colorB) => {
        const { hexToRgba, multiplyColors, rgbaToHex, normalRgbaVector } = colorsUtilities;
        const result = multiplyColors(
            normalRgbaVector(hexToRgba(colorA)),
            normalRgbaVector(hexToRgba(colorB)),
        );
        return rgbaToHex(result);
    };
}
