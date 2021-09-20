import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    VariantPropTypes,
    LinkableEntityWithGAPropTypes
} from '~/lib/prop-types'
import {
    gaDataset
} from '~/lib/ga-helpers'

import GenericLink from '~/components/_atoms/GenericLink'

import './skill-tag.scss'

const Variant = {
    Theme: {
        CaptionBold: 'caption-bold',
        CaptionBlue: 'caption-blue',
        MainBlue: 'main-blue'
    },
    Size: {
        Medium: 'medium'
    }
}

const Component = ({
        href,
        gaCategory,
        gaEvent,
        gaLabel,
        ...props
    }) =>
    href ? ( <
        GenericLink { ...props
        } { ...{
                href
            }
        } { ...gaDataset(gaCategory, gaEvent, gaLabel)
        }
        data - id = "skill-tag" /
        >
    ) : ( <
        span data - id = "skill-tag-text" { ...props
        }
        />
    )

const SkillTag = ({
    tag: {
        href,
        label,
        ...rest
    },
    style,
    theme,
    size = '',
    centered,
    className
}) => ( <
    Component styleName = {
        classNames(
            'tag',
            getVariants({
                theme,
                size
            }),
            getBooleanVariants({
                centered
            })
        )
    } { ...{
            href,
            className,
            style
        }
    } { ...rest
    } >
    {
        label
    } <
    /Component>
)

SkillTag.Variant = Variant

SkillTag.propTypes = {
    tag: PropTypes.shape({
        ...LinkableEntityWithGAPropTypes,
        href: PropTypes.string
    }).isRequired,
    theme: VariantPropTypes(Variant.Theme),
    size: VariantPropTypes(Variant.Size),
    centered: PropTypes.bool
}

SkillTag.displayName = 'SkillTag'

export default SkillTag