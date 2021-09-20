import {
    isTest
} from '@toptal/frontier'
import {
    useEffect,
    useState
} from 'react'
import {
    sampleSize
} from 'lodash'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'

/**
 * React hook for picking n elements from collection on load
 * @param {array} collection.
 * @param {number} count sample size.
 */
export const usePickRandom = (collection, count) => {
    const [items, setItems] = useState([])
    useEffect(() => {
        setItems(sampleSize(collection, count))
    }, [collection, count])

    // In test environment, we want it to be deterministic and synchronous.
    if (isTest || isVisualRegressionTest) {
        return collection.slice(0, count)
    }

    return items
}