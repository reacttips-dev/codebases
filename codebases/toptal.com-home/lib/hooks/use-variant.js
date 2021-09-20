/**
 * Returns expriment variant
 * @param {array} experiments [{name: string, variant: string}]
 * @param {string} experimentKey
 * @returns {string|null}
 */

export function useVariant(experiments = [], experimentKey) {
    const [experiment] = experiments.filter(({
        name
    }) => name === experimentKey)

    return experiment ? experiment.variant : null
}