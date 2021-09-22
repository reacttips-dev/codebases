import { getElementColors, getElementOgColors, setElementColors } from './ElementColors';
import { getIsDarkTheme } from 'owa-fabric-theme';

export function handleOnCopy(evt: React.ClipboardEvent<EventTarget>): void {
    // MessageBody whose onCopy was triggered;
    // in cases where multiple MessageBodies are in selection, this only runs on one
    const tgt = evt.currentTarget as HTMLDivElement;
    const elems = tgt.getElementsByTagName('*') as HTMLCollectionOf<HTMLElement>;
    const isDark = getIsDarkTheme();

    if (isDark) {
        // compensate for the itempart's default styles
        tgt.style.backgroundColor = 'white';
        tgt.style.color = 'black';
    }

    const elementModifiedColors = [];

    // for each element, use the og colors and store the dark mode colors
    // so that we can bring those back after copy
    for (let i = 0; i < elems.length; i++) {
        const element = elems[i];
        const originalColors = getElementOgColors(element);
        elementModifiedColors.push(getElementColors(element));
        setElementColors(element, originalColors);
    }

    // bring back dark mode colors after copy
    window.requestAnimationFrame(() => {
        if (isDark) {
            // reset the itempart's default styles to whatever.
            tgt.style.backgroundColor = '';
            tgt.style.color = '';
        }

        for (let i = 0; i < elems.length; i++) {
            setElementColors(elems[i], elementModifiedColors[i]);
        }
    });
}
