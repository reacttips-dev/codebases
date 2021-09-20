import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    noop,
    kebabCase
} from 'lodash'

import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import HtmlContent from '~/components/HtmlContent'
import {
    Button
} from '~/components/CTA'

import {
    PolicyType
} from './lib/constants'
import getLinkHiddenFromA11y from './get-link-hidden-from-a11y'

import './cookie-banner.scss'

/**
 * Shows the cookie message, either of "privacy_shield" or "gdpr" type.
 * Please consider upper-level component to see the actual cookie handling logic.
 */

const buttonThemeMapping = {
    [PolicyType.GDPR]: Button.Variant.Theme.PrimaryGreen,
    [PolicyType.PrivacyShield]: Button.Variant.Theme.SecondaryWhite
}

const CookieBanner = ({
    messageText,
    buttonText,
    policyType,
    isVisible,
    isStatic,
    onAccept = noop
}) => {
    const messageAfterAccept = getLinkHiddenFromA11y(messageText)

    return ( <
        div data - happo - hide styleName = {
            classNames(
                'root',
                getBooleanVariants({
                    isVisible,
                    isStatic
                }),
                getVariants(kebabCase(policyType))
            )
        } >
        <
        HtmlContent as = "div"
        styleName = "text"
        content = {
            isVisible ? messageText : messageAfterAccept
        }
        isUnstyled /
        >

        <
        div styleName = "button-wrapper" >
        <
        Button type = {
            Button.Type.Button
        }
        onClick = {
            onAccept
        }
        theme = {
            buttonThemeMapping[policyType]
        }
        styleName = "button" >
        {
            buttonText
        } <
        /Button> <
        /div> <
        /div>
    )
}

CookieBanner.propTypes = {
    messageText: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    policyType: VariantPropTypes(PolicyType).isRequired,
    isVisible: PropTypes.bool.isRequired,
    isStatic: PropTypes.bool,
    onAccept: PropTypes.func
}

export default CookieBanner