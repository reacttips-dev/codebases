import { PersonaInitialsColor } from '@fluentui/react/lib/Persona';
const initialColorCount = Object.keys(PersonaInitialsColor).length / 2;
export default function getTextBoyColor(name: string): PersonaInitialsColor {
    if (!name) {
        return null;
    }
    let hashCode = 0;
    for (let i = name.length - 1; i >= 0; i--) {
        let ch = name.charCodeAt(i);
        var shift = i % 8;
        hashCode ^= (ch << shift) + (ch >> (8 - shift));
    }
    return (hashCode % initialColorCount) as PersonaInitialsColor;
}
