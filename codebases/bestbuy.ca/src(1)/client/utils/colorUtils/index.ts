
export const addNumberSignPrefix = (color: string):string => {
    const numberSign = "#";
    if (color.trim().indexOf(numberSign) !== 0) {
        return numberSign + color.trim();
    }
    return color;
}
