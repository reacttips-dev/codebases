/**
 * Returns a list of randomly picked talents from _different_ verticals with _exactly one_ developer
 * @see https://toptal-core.atlassian.net/browse/PUB-521
 */
const pickTalentsRandomly = (talents, chunkSize) => {
    const verticals = groupTalentsByVerticals(talents)

    if (Object.keys(verticals).length < chunkSize) {
        throw new Error(`Not enough verticals to pick ${chunkSize} talents!`)
    }
    if (!verticals.developers) {
        throw new Error('At least one developer is expected!')
    }

    // first, shuffle verticals
    // then, randomly pick talents from first chunkSize verticals
    const result = Object.keys(verticals)
        .sort(() => Math.random() - 0.5)
        .slice(0, chunkSize)
        .map(key => {
            const talents = verticals[key]
            return talents[Math.floor(Math.random() * talents.length)]
        })

    // we could be lucky and already picked a developer,
    // otherwise let's do it manually
    if (!result.find(talent => talent.vertical.name === 'developers')) {
        const talents = verticals.developers
        result.pop()
        result.push(talents[Math.floor(Math.random() * talents.length)])
    }

    return result
}

/**
 * Returns a map where key is a vertical name
 * and value is the list of talents (on this vertical)
 */
const groupTalentsByVerticals = talents =>
    talents.reduce((acc, talent) => {
        const key = talent.vertical.name

        if (acc[key]) {
            acc[key].push(talent)
        } else {
            acc[key] = [talent]
        }
        return acc
    }, {})

export default pickTalentsRandomly