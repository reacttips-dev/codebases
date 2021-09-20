const elements = ['wordmark', 'suffix', 'headline']

const transformViewports = object =>
    Object.entries({
        default: object.default,
        tablet: object.forTablet,
        desktop: object.forDesktop,
        'desktop-large': object.forDesktopLarge
    }).reduce(
        (layoutSwitches, [viewport, restrictions]) => ({
            ...layoutSwitches,
            ...(restrictions && {
                [viewport]: restrictions
            })
        }), {}
    )

/**
 * @descritption Transforms the layout disable-switches into CSS viewport markers
 * @param {Object} layout
 * @returns {Object}
 */

export const getCssMarkerClasses = (layout, hasSuffix) => {
    layout = transformViewports(layout)

    Object.keys(layout).forEach(viewport => {
        elements.forEach(element => {
            layout[viewport][element] ? ? = true
        })
    })

    const layoutRestrictionSwitches = Object.entries(layout).reduce(
        (switches, [viewport, restrictions]) => {
            elements.forEach(element => {
                const isEnabled = restrictions[element] ? ? true
                const lastSwitch =
                    Object.values(switches)
                    .map(viewportSwitches => viewportSwitches[element])
                    .filter(value => value !== undefined)
                    .pop() ? ? true
                const wasDisabled = !lastSwitch
                let value = null
                if (isEnabled) {
                    if (wasDisabled) {
                        value = true
                    }
                } else if (!wasDisabled) {
                    value = false
                }

                if (value !== null) {
                    switches[viewport] = {
                        ...switches[viewport],
                        [element]: value
                    }
                }
            })

            return switches
        }, {}
    )

    const markers = elements.reduce(
        (acc, element) => ({
            ...acc,
            [element]: Object.entries(layoutRestrictionSwitches).reduce(
                (switches, [viewport, restrictions]) => {
                    if (restrictions[element] !== undefined) {
                        switches[viewport] = restrictions[element] ? 'visible' : 'hidden'
                    }

                    return switches
                }, {}
            )
        }), {}
    )

    markers.container = Object.entries(layout).reduce(
        (containerMarkers, [viewport, elementSwitches]) => {
            const {
                wordmark,
                suffix
            } = elementSwitches
            const previousMarker = Object.values(containerMarkers).pop() ? ? 'disabled'
            if (!wordmark && (!hasSuffix || !suffix)) {
                if (previousMarker.endsWith('disabled')) {
                    containerMarkers[viewport] = 'align-center-enabled'
                }
            } else if (previousMarker.endsWith('enabled')) {
                containerMarkers[viewport] = 'align-center-disabled'
            }

            return containerMarkers
        }, {}
    )

    return markers
}