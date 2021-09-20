import React, {
    useState,
    useMemo,
    useCallback
} from 'react'
import PropTypes from 'prop-types'

import unorphan from '~/lib/unorphan'
import {
    useValueByMedia
} from '~/lib/hooks'
import {
    CollectionPropTypes
} from '~/lib/prop-types'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'
import {
    PageSection
} from '~/components/Library'
import Vimeo from '~/components/Vimeo'

import ClientsCarousel from './ClientsCarousel'

import './trustbar.scss'

const ChunkSize = {
    DesktopLarge: 6,
    Desktop: 4,
    Tablet: 3,
    Mobile: 2
}

function useTrustbar(clients) {
    const [selected, setSelected] = useState(null)

    const chunkSize = useValueByMedia({
            default: ChunkSize.Mobile,
            forTablet: ChunkSize.Tablet,
            forDesktop: ChunkSize.Desktop,
            forDesktopLarge: ChunkSize.DesktopLarge
        },
        null
    )

    const videos = useMemo(
        () =>
        clients.map(({
            videoIdentifier: id,
            title,
            identifier
        }) => ({
            id,
            title,
            trackingLabel: identifier
        })), [clients]
    )

    return {
        chunkSize,
        videos,
        selected,
        setSelected
    }
}

const GA_CATEGORY = 'trustbar_video'

const Trustbar = ({
    title,
    clients,
    className,
    light
}) => {
    const {
        chunkSize,
        setSelected,
        videos,
        selected
    } = useTrustbar(clients)

    const handleClickClient = useCallback(
        ({
            index
        }) => {
            trackGAEvent(GA_CATEGORY, 'video_open', videos[index].trackingLabel)
            setSelected({
                index
            })
        }, [videos, setSelected]
    )

    return ( <
        div styleName = "root"
        className = {
            className
        } >
        <
        PageSection styleName = "inner-container"
        width = {
            PageSection.Variant.Width.Fixed
        } >
        <
        p styleName = "title" > {
            unorphan(title)
        } < /p> <
        ClientsCarousel styleName = "clients-carousels" { ...{
                clients,
                chunkSize,
                light
            }
        }
        onClick = {
            handleClickClient
        }
        /> <
        Vimeo.Popup { ...{
                videos,
                selected
            }
        }
        open = {!!selected
        }
        onChange = {
            setSelected
        }
        onClose = {
            setSelected
        }
        titleComponent = {
            ({
                title
            }) => ( <
                >
                <
                span > {
                    title
                } < /span> <
                span styleName = "title-postfix" > Case Study < /span> <
                />
            )
        }
        gaCategory = {
            GA_CATEGORY
        }
        /> <
        /PageSection> <
        /div>
    )
}

Trustbar.dataPropTypes = {
    title: PropTypes.string,
    clients: CollectionPropTypes({
        title: PropTypes.string.isRequired,
        identifier: PropTypes.string.isRequired,
        videoIdentifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
}

Trustbar.propTypes = {
    ...Trustbar.dataPropTypes,
    className: PropTypes.string
}

Trustbar.displayName = 'Trustbar'

export default Trustbar