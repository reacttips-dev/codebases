import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    LinkableEntityArray,
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import GenericLink from '~/components/_atoms/GenericLink'
import SocialIcon from '~/components/SocialIcon'

import './social-link-list.scss'

const Variant = {
    Theme: {
        Light: 'light',
        Grey: 'grey',
        Blue: 'blue'
    }
}

const SocialLinkList = ({
    links,
    theme = Variant.Theme.Light,
    gaCategory,
    gaAction
}) => ( <
    ul styleName = {
        classNames('list', getVariants({
            theme
        }))
    } > {
        links.map(({
            href,
            label
        }) => ( <
            li key = {
                href + label
            }
            styleName = "item" >
            <
            GenericLink styleName = "link"
            aria - label = {
                label
            }
            title = {
                label
            }
            target = "_blank"
            rel = "noreferrer noopener" { ...{
                    href,
                    gaCategory
                }
            }
            gaEvent = {
                gaAction
            }
            gaLabel = {
                `social_${label}_button_click`
            } >
            <
            SocialIcon type = {
                label
            }
            size = "18" / >
            <
            /GenericLink> <
            /li>
        ))
    } <
    /ul>
)

SocialLinkList.propTypes = {
    links: LinkableEntityArray.isRequired,
    theme: VariantPropTypes(Variant.Theme),
    gaCategory: PropTypes.string,
    gaEvent: PropTypes.string
}

SocialLinkList.Variant = Variant

export default SocialLinkList