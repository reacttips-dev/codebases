import { getIsDarkTheme } from 'owa-fabric-theme';

export function getBigHoverActionButtonColors(styles: any, action: string) {
    switch (action) {
        case 'Delete':
            return getIsDarkTheme()
                ? styles.showDeleteIconButtonDark
                : styles.showDeleteIconButtonLight;
        case 'Archive':
            return getIsDarkTheme()
                ? styles.showArchiveIconButtonDark
                : styles.showArchiveIconButtonLight;
    }

    return null;
}
