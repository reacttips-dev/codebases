import classNames from 'classnames'
import {
    isObject,
    kebabCase
} from 'lodash'

const getNamespacePrefix = (namespace, index) => {
    let prefix = 'is'

    if (namespace) {
        prefix += `-${Array.isArray(namespace) ? namespace[index] : namespace}`
    }

    return prefix
}

const getVariants = (variant, namespace = '', strict = true) => {
    if (!Array.isArray(variant)) {
        if (isObject(variant)) {
            const namespaces = Object.keys(variant)
            const variants = Object.values(variant)

            namespace = variants.reduce((result, values, index) => {
                const current = Array.isArray(values) ? values : [values]

                current.forEach(_ => {
                    result.push(namespaces[index])
                })

                return result
            }, [])

            variant = variants.flat()
        } else {
            variant = [variant]
        }
    }

    return variant.reduce((variants, item, index) => {
        if (strict || item) {
            variants[`${getNamespacePrefix(namespace, index)}-${item}`] = !!item
        }

        return variants
    }, {})
}

export const getBooleanVariants = variants =>
    Object.entries(variants).reduce(
        (variants, [name, value]) => ({
            ...variants,
            [`is-${kebabCase(name.replace(/^is/, ''))}`]: !!value
        }), {}
    )

/**
 * Since classNames returns empty string when no classes were applied,
 * this utility helps to avoid prop-types warning when passing as a prop validated as PropTypes.oneOf(variants).
 * e.g. variant={variantName({ 'my-variant': falsyExpression })}
 * @param variants
 * @returns {string | undefined}
 */
export const variantNames = variants => classNames(variants) || undefined

export default getVariants