import { screenSizes } from './props';
export function typography(selector) {
    return function (props) {
        var typo = selector(props.theme.typographies);
        var color = typo.color ? "color: " + typo.color + ";" : '';
        var family = typo.family ? "font-family: " + typo.family + ";" : '';
        var height = typo.height ? "line-height: " + typo.height + ";" : '';
        var size = typo.size ? "font-size: " + typo.size + ";" : '';
        var textTransform = typo.textTransform ? "text-transform: " + typo.textTransform : '';
        var weight = typo.weight ? "font-weight: " + typo.weight + ";" : '';
        return "\n            " + color + "\n            " + family + "\n            " + size + "\n            " + weight + "\n            " + height + "\n            " + textTransform + "\n        ";
    };
}
export function color(selector) {
    return function (props) {
        return selector(props.theme.colors);
    };
}
export function theme(selector) {
    return function (props) {
        return selector(props.theme);
    };
}
export function maxWidthForScreen(screenSize) {
    return screenSizes.screen[screenSize].max + "px";
}
export function minWidthForScreen(screenSize) {
    return screenSizes.screen[screenSize].min + "px";
}
export var bodyMargin = 8;
//# sourceMappingURL=utils.js.map