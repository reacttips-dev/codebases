/**
 *
 * @param experiments {{name: string, variant: string}[]}
 * @param experimentName {string}
 * @returns {string}
 */
const getExperimentVariant = (experiments, experimentName) => {
    const experiment = experiments.find(({
        name
    }) => name === experimentName)

    return experiment ? .variant
}

export default getExperimentVariant