/** Creates an object that represent the different forms of a unit's suffix */
export default function createSingularPluralStrings(
    singular: string,
    firstPlural: string,
    secondPlural: string
) {
    return {
        singular: singular,
        firstPlural: firstPlural,
        secondPlural: secondPlural,
    };
}
