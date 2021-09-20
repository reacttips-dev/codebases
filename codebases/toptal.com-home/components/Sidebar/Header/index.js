import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    getBooleanVariants
} from '~/lib/get-variants'

import CompoundLogo from '~/components/CompoundLogo'
import {
    CloseIcon
} from '~/components/_atoms/Icons'

import './header.scss'

const Header = ({
    isSticky,
    onDismiss
}) => ( <
    div styleName = {
        classNames(
            'container',
            getBooleanVariants({
                isSticky
            })
        )
    } >
    <
    div styleName = "header" >
    <
    CompoundLogo / >
    <
    div styleName = "button-close"
    onClick = {
        onDismiss
    } >
    <
    CloseIcon / >
    <
    /div> <
    /div> <
    /div>
)

Header.propTypes = {
    onDismiss: PropTypes.func.isRequired,
    isSticky: PropTypes.bool
}

export default Header