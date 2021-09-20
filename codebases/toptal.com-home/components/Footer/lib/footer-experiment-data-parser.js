import getExperimentVariant from '~/lib/get-experiment-variant'

import {
    FOOTER_EXPERIMENT_KEY,
    ExperimentVariant
} from './constants'

/**
 * Adds the React link to the 'Most In-Demand Talent' default footer column for a sitewide A/B experiment
 * Will be cleaned up after experiment ends
 */
const footerExperimentDataParser = (
    columns = [],
    chameleonExperiments = []
) => {
    const footerVariant = getExperimentVariant(
        chameleonExperiments,
        FOOTER_EXPERIMENT_KEY
    )
    const parsed = JSON.parse(JSON.stringify(columns))
    if (footerVariant === ExperimentVariant.WithLink) {
        const columnIndex = parsed.findIndex(
            column => column.title === 'Most In-Demand Talent'
        )
        const column = parsed[columnIndex]
        if (
            columnIndex > -1 &&
            column.links[column.links.length - 1].href !== '/react'
        ) {
            column.links = [
                ...column.links,
                {
                    label: 'React Developers',
                    href: '/react'
                }
            ]
        }
    }

    return parsed
}

export default footerExperimentDataParser