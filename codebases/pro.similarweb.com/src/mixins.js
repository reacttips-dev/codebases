import {$swBaseFontSize, $sansFontFamily} from './fonts';

export const calcRemFontSize = ($fontSize) => {
    $fontSize = parseFloat($fontSize, 10);
    return `
        font-size: ${$fontSize}px;
        font-size: ${($fontSize / $swBaseFontSize)}rem;
    `
}
export const setFont = ({$family = $sansFontFamily, $weight = false, $size = false, $color = false}) => {
    if ($family == $sansFontFamily && $weight == 'bold') {
        $weight = '600';
    }
    return `
        font-family: ${$family};
        ${$weight ? `font-weight: ${$weight}` : ''};
        ${$size ? calcRemFontSize($size) : ''}
        ${$color ? `color: ${$color}` : ''} 
    `

}
export const truncateText = ({$overflow = "ellipsis"} = {}) => `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ${$overflow};
`

export const triangle = ({$direction, $size = 8, $color = "#222"}) => {
    const size = `${parseInt($size)}px`;
    const style = `content: '';
        display: block;
        position: absolute;
        height: 0;
        width: 0;`;

    let borders = "";
    switch ($direction) {
        case "up":
            borders = `border-bottom: ${size} solid ${$color};
            border-left: ${size}  solid transparent;
            border-right: ${size}  solid transparent;
            border-top: none;`;
            break;
        case "down":
            borders = `border-top: ${size}  solid ${$color};
            border-left: ${size}  solid transparent;
            border-right: ${size}  solid transparent;
            border-bottom: none;`;
            break;
        case "left":
            borders = `border-top: ${size}  solid transparent;
            border-bottom: ${size}  solid transparent;
            border-right: ${size}  solid ${$color};
            border-left: none;`;
            break;
        case "right":
            borders = `border-top: ${size}  solid transparent;
            border-bottom: ${size}  solid transparent;
            border-left: ${size}  solid ${$color};
            border-right: none;`;
            break;
    }

    return `${style}
    ${borders}`;
}

const breakpoints = {
    $smartphone: "568px",
    //iphone 5
    $tabletPortrait: "767px",
    $tabletLandscape: "1024px",
    $desktop: "1280px",
    $largeScreen: "1400px",
    $xLargeScreen: "1920px",
    $mediumDesktop: "1200px",
    $mediumScreen: "1366px",
    $largeLaptop: "1600px",
}

export function respondTo($media, content) {
    switch ($media) {
        case "smartphone":
            return getMediaQuery(content, breakpoints.$smartphone);
        case "tablet":
            return getMediaQuery(content, breakpoints.$tabletLandscape, breakpoints.$tabletPortrait);
        case "smallScreen":
        case "desktop":
            return getMediaQuery(content, breakpoints.$desktop);
        case "mediumDesktop":
            return getMediaQuery(content, breakpoints.$mediumDesktop);
        case "mediumScreen":
            return getMediaQuery(content, breakpoints.$mediumScreen);
        case "xLargeScreen":
            return getMediaQuery(content, breakpoints.$xLargeScreen);
        case "largeLaptop":
            return getMediaQuery(content, breakpoints.$largeLaptop);
        default:
            console.warn("No predefined media query found");
    }
}

function getMediaQuery(content, maxWidth, minWidth) {
    let conditions;
    // both minWidth and maxWidth
    if (minWidth && maxWidth) {
        conditions = `${getMinWidth(minWidth)} and ${getMaxWidth(maxWidth)}`;
    } else {
        // only minWidth
        if (minWidth) {
            conditions = `${getMinWidth(minWidth)}`;
        }
        // only maxWidth
        else {
            conditions = `${getMaxWidth(maxWidth)}`;
        }
    }
    //let result = "@media " + conditions + " {" + content +"}";
    let result = `@media ${conditions} \{${content}\}`;

    return result;
}

function getMaxWidth(maxWidth) {
    return `(max-width: ${maxWidth})`;
}

function getMinWidth(minWidth) {
    return `(min-width: ${minWidth})`;
}
