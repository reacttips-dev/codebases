import { mutatorAction } from 'satcheljs';
import type { ExtendedPalette } from '../store/schema/ExtendedTheme';
import store from '../store/store';

export default mutatorAction(
    'MUTATE_FABRIC_THEME',
    (themeSymbols: Partial<ExtendedPalette>, isDarkTheme: boolean) => {
        store().palette = themeSymbols;
        store().isInverted = isDarkTheme;
        if (!store().density) {
            store().density = {
                components: {
                    CommandBar: {
                        styles: {
                            root: {
                                backgroundColor: themeSymbols.neutralLighter,
                            },
                        },
                    },
                    Icon: {
                        styles: {
                            root: {
                                // For some reason, only in IE11, and only when deploying (not in gulp dev),
                                // Fabric's `display: inline-block` style takes precedence over any custom
                                // style we apply to the display property for icons. This causes visual regressions
                                // in IE11 that look really bad.
                                display: null,
                            },
                        },
                    },
                },
            };
        } else {
            const density = store().density || {};
            store().density = {
                tokens: density.tokens,
                components: {
                    ...(density.components || {}),
                    CommandBar: {
                        styles: { root: { backgroundColor: store().palette?.neutralLighter } },
                    },
                },
            };
        }
    }
);
