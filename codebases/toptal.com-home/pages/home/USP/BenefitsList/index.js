import React from 'react'
import classNames from 'classnames'

import Benefit from '~/components/Benefit'
import Grid, {
    Cell
} from '~/components/Grid'

import './benefits-list.scss'

const cellSize = {
    tablet: {
        1: 12,
        2: 6,
        3: 4,
        4: 6
    },
    desktop: {
        1: 12,
        2: 12,
        3: 4,
        4: 6
    }
}

export default ({
    benefits,
    className
}) => {
    const nItems = benefits.length

    return ( <
        Grid styleName = {
            classNames('container', {
                'is-column': nItems === 2,
                'is-single': nItems === 1
            })
        } { ...{
                className
            }
        }
        role = {
            nItems ? 'list' : null
        } >
        {
            benefits.map(benefit => ( <
                Cell key = {
                    benefit.title
                }
                tablet = {
                    cellSize.tablet[nItems]
                }
                desktop = {
                    cellSize.desktop[nItems]
                }
                role = "listitem" >
                <
                div styleName = "benefit" >
                <
                Benefit { ...benefit
                }
                /> <
                /div> <
                /Cell>
            ))
        } <
        /Grid>
    )
}