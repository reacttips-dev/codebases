import { registerIcons } from '@fluentui/style-utilities/lib/index'; // @fluentui/style-utilities is an optional dependency, so we have to account for the package not being present.

export type IconMap = { [iconName: string]: string };

export interface IconFontRegistration {
    fontFileName: string;
    icons: IconMap;
}

interface RegisteredFontsMap {
    [fontFileName: string]: true;
}
const registeredFonts: RegisteredFontsMap = {};

export default function registerFontSubsets(
    packageBaseUrl: string,
    registrations: IconFontRegistration[] | undefined
): void {
    if (!packageBaseUrl || !registrations) {
        return;
    }

    registrations.forEach(fontRegistration => {
        const fontFileName = fontRegistration.fontFileName;
        if (!registeredFonts[fontFileName]) {
            registeredFonts[fontFileName] = true;
            registerIcons({
                style: {
                    MozOsxFontSmoothing: 'grayscale',
                    WebkitFontSmoothing: 'antialiased',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    speak: 'none',
                },
                fontFace: {
                    fontFamily: `"${fontFileName}"`,
                    src: `url('${packageBaseUrl}resources/fonts/${fontFileName}.woff') format('woff')`,
                },
                icons: fontRegistration.icons,
            });
        }
    });
}
