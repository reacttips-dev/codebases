/**
 * @description A helper to convert GA props trio to HTML-ready dataset
 * @param {String} category
 * @param {String} event
 * @param {String} label
 * @returns {Object} HTML-ready dataset
 */
export const toHtmlGaDataset = (category, event, label) => ({
    'data-ga-category': category,
    'data-ga-event': event,
    'data-ga-label': label
})

/**
 * @description Converts provided GA props trio or an object to a dataset to be attached to HTML tag
 * @param {String|Object} gaCategory
 * @param {String} gaEvent
 * @param {String} gaLabel
 * @returns {Object} HTML-ready dataset
 */
export const gaDataset = (gaCategory, gaEvent, gaLabel) => {
    if (!gaCategory) {
        return {}
    }

    if (gaCategory.gaCategory) {;
        ({
            gaCategory,
            gaEvent,
            gaLabel
        } = gaCategory)
    }

    return toHtmlGaDataset(gaCategory, gaEvent, gaLabel)
}

/**
 * @description A factory to create GA dataset makers with a predefined GA category and event
 * @param {String} category
 * @param {String} defaultEvent
 * @returns {Object} HTML-ready dataset
 */
export const createGADataset = (category, defaultEvent) => (
    label,
    event = defaultEvent
) => gaDataset(category, event, label)

/**
 * @description A helper function to convert analytics props into HTML-ready dataset
 * @param {String} sectionId
 * @param {String} analyticsId
 * @returns {Object} HTML-ready dataset
 */
export const analyticsDataset = ({
    sectionId,
    analyticsId
}) => ({
    'section-id': sectionId,
    'analytics-id': analyticsId
})