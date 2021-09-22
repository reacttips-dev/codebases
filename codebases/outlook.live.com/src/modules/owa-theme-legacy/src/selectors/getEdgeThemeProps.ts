import getTheme from './getTheme';
import {
    edgeTheme1BingButtonText,
    edgeTheme2BingButtonText,
    edgeTheme3BingButtonText,
    edgeTheme4BingButtonText,
    edgeTheme5BingButtonText,
    edgeTheme6BingButtonText,
    edgeTheme7BingButtonText,
    edgeTheme8BingButtonText,
    edgeTheme9BingButtonText,
    edgeTheme10BingButtonText,
    edgeTheme11BingButtonText,
    edgeTheme12BingButtonText,
    edgeTheme13BingButtonText,
    edgeTheme14BingButtonText,
    edgeTheme15BingButtonText,
    edgeTheme16BingButtonText,
    edgeTheme17BingButtonText,
    edgeTheme18BingButtonText,
    edgeTheme19BingButtonText,
    edgeTheme20BingButtonText,
} from '../view/edgeThemes.locstring.json';
import loc from 'owa-localize';
import { getOwaResourceImageUrl } from 'owa-resource-url';

export interface EdgeThemeProps {
    bingQueryButtonText: string;
    bingQueryDescription?: string;
}

export default function getEdgeThemeProps(): EdgeThemeProps {
    const EdgeThemePropsConst: { [themeName: string]: EdgeThemeProps } = {
        ['edge1']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme1BingButtonText) },
        ['edge2']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme2BingButtonText) },
        ['edge3']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme3BingButtonText) },
        ['edge4']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme4BingButtonText) },
        ['edge5']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme5BingButtonText) },
        ['edge6']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme6BingButtonText) },
        ['edge7']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme7BingButtonText) },
        ['edge8']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme8BingButtonText) },
        ['edge9']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme9BingButtonText) },
        ['edge10']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme10BingButtonText) },
        ['edge11']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme11BingButtonText) },
        ['edge12']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme12BingButtonText) },
        ['edge13']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme13BingButtonText) },
        ['edge14']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme14BingButtonText) },
        ['edge15']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme15BingButtonText) },
        ['edge16']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme16BingButtonText) },
        ['edge17']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme17BingButtonText) },
        ['edge18']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme18BingButtonText) },
        ['edge19']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme19BingButtonText) },
        ['edge20']: <EdgeThemeProps>{ bingQueryButtonText: loc(edgeTheme20BingButtonText) },
    };

    let currentTheme = getTheme();
    return EdgeThemePropsConst[currentTheme]
        ? EdgeThemePropsConst[currentTheme]
        : { bingQueryButtonText: '' };
}

export function getEmptyStateBingLogo() {
    return getOwaResourceImageUrl('emptyState/binglogo.png');
}
