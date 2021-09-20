import React from 'react'

import {
    useIsIE11
} from '~/lib/hooks'

import BurgerMenuButton from '~/components/BurgerMenuButton'

const Toggle = ({
    open,
    onToggle,
    className
}) => {
    if (useIsIE11()) {
        return null
    }

    return <BurgerMenuButton { ...{
            open,
            onToggle,
            className
        }
    }
    />
}

Toggle.propTypes = {
    ...BurgerMenuButton.propTypes
}

Toggle.displayName = 'Toggle'

export default Toggle