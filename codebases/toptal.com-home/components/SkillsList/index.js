import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes,
    LinkableEntityArray,
    LinkableEntityPropTypesShape
} from '~/lib/prop-types'
import unorphan from '~/lib/unorphan'
import getVariants from '~/lib/get-variants'

import TextLink from '~/components/_atoms/TextLink'
import ArrowLink from '~/components/_atoms/ArrowLink'

import './skills-list.scss'

const Variant = {
    Theme: {
        Dark: 'dark'
    }
}

const SkillsList = ({
    title,
    skillPages,
    cta,
    theme,
    className
}) => ( <
    div className = {
        className
    }
    styleName = {
        classNames('container', getVariants({
            theme
        }))
    }
    data - id = "skills-list-container" >
    {
        title && ( <
            h2 styleName = "title"
            data - id = "skills-list-title" > {
                title
            } <
            /h2>
        )
    }

    <
    ul styleName = "skills-list" > {
        skillPages.map(({
            label,
            href
        }) => ( <
            li key = {
                label + href
            }
            styleName = "list-item" >
            <
            TextLink theme = {
                TextLink.Variant.Theme.LightGrey
            } { ...{
                    label,
                    href
                }
            }
            styleName = "link"
            data - id = "skill-link" /
            >
            <
            /li>
        ))
    }

    {
        cta && ( <
            li styleName = "list-item" >
            <
            ArrowLink href = {
                cta.href
            }
            label = {
                unorphan(cta.label)
            }
            size = {
                ArrowLink.Variant.Size.Small
            } { ...(theme === Variant.Theme.Dark && {
                    theme: ArrowLink.Variant.Theme.White
                })
            }
            /> <
            /li>
        )
    } <
    /ul> <
    /div>
)

SkillsList.Variant = Variant

SkillsList.propTypes = {
    title: PropTypes.string,
    cta: LinkableEntityPropTypesShape,
    skillPages: LinkableEntityArray.isRequired,
    theme: VariantPropTypes(SkillsList.Variant.Theme)
}

export default SkillsList