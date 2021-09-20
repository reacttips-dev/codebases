import React, {
    useEffect,
    useMemo,
    useState,
    memo
} from 'react'
import classNames from 'classnames'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'

import Carousel, {
    Slide
} from '~/components/Carousel'
import ClientLogo from '~/components/_atoms/ClientLogo'
import {
    getVideoLink
} from '~/components/Vimeo/Player'

import './clients-carousel.scss'

const ClientLogoContainer = ({
        children,
        url,
        onClick,
        ...props
    }) =>
    url ? ( <
        a { ...props
        }
        rel = "nofollow"
        href = {
            url
        }
        onClick = {
            onClick
        }
        styleName = "is-clickable"
        aria - label = {
            props.title
        } >
        {
            children
        } <
        /a>
    ) : ( <
        span role = "figure" { ...props
        } > {
            children
        } <
        /span>
    )

const ClientLogoItem = ({
        title,
        identifier,
        videoIdentifier,
        originalIndex,
        onClick,
        light
    }) => ( <
        ClientLogoContainer key = {
            title
        }
        title = {
            title
        }
        aria - label = {
            `Watch the ${title} case study`
        }
        url = {
            videoIdentifier && getVideoLink(videoIdentifier, {
                autoplay: true
            })
        }
        styleName = {
            classNames('logo-container', {
                'is-light': light
            })
        }
        onClick = {
            e => {
                e.preventDefault()
                videoIdentifier && onClick && onClick({
                    index: originalIndex
                })
            }
        } >
        <
        ClientLogo styleName = "logo"
        identifier = {
            identifier
        }
        /> {
            videoIdentifier && < p styleName = "label" > Watch the
            case study < /p>} <
            /ClientLogoContainer>
        )

        const LOKI_CHANGE_INTERVAL = 24 * 60 * 1000
        const CHANGE_INTERVAL = 5000

        const CarouselSlides = memo(
            ({
                clients,
                activeItemIndex,
                numberOfSlides,
                chunkSize,
                light,
                onClick
            }) =>
            Array.from({
                length: numberOfSlides
            }, (_, chunkIndex) => {
                let startIndex = chunkSize * chunkIndex
                let endIndex = chunkSize * (chunkIndex + 1)
                if (endIndex > clients.length) {
                    startIndex -= endIndex - clients.length
                    endIndex = clients.length
                }
                const items = clients.slice(startIndex, endIndex)
                return ( <
                    Slide styleName = "clients"
                    active = {
                        activeItemIndex === chunkIndex
                    }
                    key = {
                        chunkIndex
                    } >
                    {
                        items.map(item => ( <
                            ClientLogoItem key = {
                                item.title
                            } { ...item
                            }
                            light = {
                                light
                            }
                            onClick = {
                                onClick
                            }
                            />
                        ))
                    } <
                    /Slide>
                )
            })
        )

        const ClientsCarousel = ({
            chunkSize,
            onClick,
            className,
            light,
            ...props
        }) => {
            const [isLoaded, setIsLoaded] = useState(false)
            const waitingForChunkSize = !chunkSize
            if (waitingForChunkSize) {
                chunkSize = props.clients.length
            }
            const numberOfSlides = Math.ceil(props.clients.length / chunkSize)

            const clients = useMemo(() => {
                return props.clients.map((item, originalIndex) => ({
                    ...item,
                    originalIndex
                }))
            }, [props.clients])

            useEffect(() => {
                const loadTimer = setTimeout(() => {
                    setIsLoaded(true)
                }, 1000)
                return () => {
                    clearTimeout(loadTimer)
                }
            }, [])

            return ( <
                Carousel { ...{
                        numberOfSlides
                    }
                }
                className = {
                    className
                }
                styleName = {
                    classNames('clients-carousel', {
                        'is-loaded': isLoaded && !isVisualRegressionTest,
                        'is-invisible': waitingForChunkSize,
                        'is-static': isVisualRegressionTest
                    })
                }
                changeInterval = {
                    isVisualRegressionTest ? LOKI_CHANGE_INTERVAL : CHANGE_INTERVAL
                } >
                {
                    activeItemIndex => ( <
                        CarouselSlides { ...{
                                clients,
                                activeItemIndex,
                                numberOfSlides,
                                chunkSize,
                                light,
                                onClick
                            }
                        }
                        />
                    )
                } <
                /Carousel>
            )
        }

        export default ClientsCarousel