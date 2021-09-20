import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    CollectionPropTypes
} from '~/lib/prop-types'
import ArrowIcon from '-!svg-react-loader!../assets/arrow-left.svg'

import TalentCard from '~/components/TalentCard'
import {
    PageSection
} from '~/components/Library'
import ImagePreloader from '~/components/ImagePreloader'

import {
    TalentPropTypes
} from '../lib/prop-types'

import useTalentSlider from './lib/use-talent-slider'
import {
    gaDataset,
    gaCategory,
    gaEvent,
    gaLabels
} from './lib/google-analytics'

import './talent-slider.scss'

const Arrow = ({
    onClick,
    disabled,
    right
}) => ( <
    div styleName = {
        classNames('arrow', getBooleanVariants({
            right
        }))
    } { ...{
            onClick,
            disabled
        }
    } { ...gaDataset(right ? gaLabels.ClickArrowRight : gaLabels.ClickArrowLeft)
    } >
    <
    ArrowIcon / >
    <
    /div>
)

const TalentSlider = ({
    talents,
    selected,
    onChange
}) => {
    const {
        itemsRefs,
        containerRef,
        loadedImages,
        focusedIndex,
        isAtScrollStart,
        isAtScrollFull,
        setFocusedIndex,
        handlePhotoLoad,
        handleCardClick,
        handleLeftClick,
        handleRightClick,
        handleSectionKeyDown,
        toggleIsUserControlled
    } = useTalentSlider({
        talents,
        selected,
        onChange
    })

    return ( <
        >
        <
        ImagePreloader images = {
            [talents[0].heroImageUrl]
        }
        /> <
        PageSection styleName = "center"
        width = {
            PageSection.Variant.Width.Fixed
        }
        onKeyDown = {
            handleSectionKeyDown
        }
        onMouseEnter = {
            toggleIsUserControlled
        }
        onMouseLeave = {
            toggleIsUserControlled
        }
        onFocus = {
            toggleIsUserControlled
        }
        onBlur = {
            toggleIsUserControlled
        } >
        <
        Arrow onClick = {
            handleLeftClick
        }
        disabled = {
            isAtScrollStart
        }
        /> <
        div styleName = "container"
        ref = {
            containerRef
        }
        role = "list" > {
            talents.map((talent, index) => ( <
                TalentCard key = {
                    talent.fullName
                }
                ref = {
                    itemsRefs.current[index]
                }
                data = {
                    {
                        avatar: talent.imageUrl,
                        name: talent.fullName,
                        role: talent.jobTitle,
                        vertical: talent.vertical,
                        publicResumeUrl: talent.publicResumeUrl,
                        gaCategory,
                        gaEvent,
                        gaLabel: gaLabels.ClickTalentName + (index + 1)
                    }
                }
                styleName = {
                    classNames(
                        'talent',
                        getBooleanVariants({
                            selected: selected === index,
                            hidden: !loadedImages[index]
                        })
                    )
                }
                onClick = {
                    handleCardClick
                }
                afterLoad = {
                    handlePhotoLoad
                }
                onFocus = {
                    setFocusedIndex
                }
                isFocused = {
                    focusedIndex === index
                }
                role = "listitem" { ...{
                        onChange,
                        index
                    }
                }
                />
            ))
        } <
        /div> <
        Arrow right onClick = {
            handleRightClick
        }
        disabled = {
            isAtScrollFull
        }
        /> <
        /PageSection> <
        />
    )
}

TalentSlider.propTypes = {
    talents: CollectionPropTypes(TalentPropTypes),
    selected: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}

export default TalentSlider