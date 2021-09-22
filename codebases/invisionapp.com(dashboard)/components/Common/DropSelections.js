import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { animated } from 'react-spring'
import { Spring } from 'react-spring/renderprops.cjs'
import cx from 'classnames'
import { DocumentIcon } from '@invisionapp/helios'

import { DOCUMENT_TYPES, FREEHAND, UNTITLED } from '../../constants/DocumentTypes'

import { selectedDocuments } from '../../selectors/documents'

import styles from '../../css/common/drop-selections.css'

const springConfig = { tension: 200, friction: 13, clamp: true }
const fadeOutConfig = { tension: 385, friction: 26, velocity: -2, clamp: true }

let initialMouseCoords = { x: 0, y: 0 }
let dropMouseCoords = { x: 0, y: 0 }
let triggerDrop = false

const DropSelections = props => {
  const allDocuments = useSelector(selectedDocuments)

  const [isAddingToSpace, setIsAddingToSpace] = useState(false)

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp, false)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp, false)
    }
  }, [])

  useEffect(() => {
    if (props.isDropping) triggerDrop = true

    return () => {
      initialMouseCoords.x = 0
      initialMouseCoords.y = 0
    }
  }, [props.isDropping])

  if ((props.x !== 0 || props.y !== 0) && initialMouseCoords.x === 0 && initialMouseCoords.y === 0) {
    initialMouseCoords = { x: props.x, y: props.y }
  }

  const handleMouseUp = e => {
    if (!triggerDrop) return

    if (e.target.closest('[data-space-droparea="true"]')) {
      dropMouseCoords.x = e.clientX
      dropMouseCoords.y = e.clientY
      setIsAddingToSpace(true)
    }

    triggerDrop = false
  }

  const renderDocIcon = (resourceType, iconSrc) => {
    const fileIconSrc = props?.externalTypesConfig?.[resourceType]?.logoSrc || props?.getExtDocFallbackIcon?.(resourceType)

    return (
      resourceType === FREEHAND && iconSrc && props.enableFreehandXFilteringSorting ? (
        <img className={styles.customFreehandIcon} src={iconSrc} alt='Freehand' />
      )
        : (<DocumentIcon
          size={18}
          documentType={DOCUMENT_TYPES[resourceType] ? (resourceType === 'presentation' ? 'prototype' : resourceType) : undefined}
          src={DOCUMENT_TYPES[resourceType] ? undefined : fileIconSrc}
        />)
    )
  }

  const renderTiles = () => {
    let visibleCount = 0
    return allDocuments.map((sel, idx) => {
      // Find matching div
      const match = document.querySelector(`[data-type="${sel.type}"][data-id="${sel.id}"]`)
      if (!match) return

      visibleCount++

      // Trying to avoid duplication of styles as much as possible, so we get the
      // tile bounds & text to programatically recreate these tile elements as much
      // as possible.
      const title = match.dataset['title'] || UNTITLED
      const iconSrc = match.dataset['iconSrc'] || UNTITLED

      const bounds = match.getBoundingClientRect()
      const thumbnail = match.querySelector('img') ? match.querySelector('img').src : ''
      const thumbnailBounds = thumbnail ? match.querySelector('img')?.getBoundingClientRect() : null
      const thumbnailWrapBounds = match.querySelector('figure')?.getBoundingClientRect()
      const innerMetaText = match.querySelector('article > div > div')?.innerText?.split('\n')

      // How many ternary operations can we get on one line? :)
      // The logic here:
      // - if there is only one card, no rotatation
      // - if multiple cards, we're doing:
      //   - card 1 - -2deg
      //   - card 2 - 4deg
      //   - card 3 - -8deg
      const rotation = allDocuments.length === 1 ? 0 : idx === 0 ? -2 : idx % 2 === 0 ? 4 : -8

      const thumbnailWrapHeight = (bounds.height ? (thumbnailWrapBounds?.height / bounds.height) : 0) * 100
      const metaHeight = 100 - thumbnailWrapHeight

      const from = isAddingToSpace ? {
        width: 175,
        height: 156,
        transform: `translate3d(-162px, 5px, 0) rotate(${rotation}deg) scale(1.0)`,
        opacity: idx > 4 && visibleCount >= 3 ? 0 : 1
      } : {
        width: bounds.width,
        height: bounds.height,
        transform: `translate3d(${bounds.x - initialMouseCoords.x - (bounds.width / 2)}px, ${bounds.y - initialMouseCoords.y}px, 0) rotate(0deg) scale(1.0)`,
        opacity: 1
      }

      const to = isAddingToSpace ? {
        width: 175,
        height: 156,
        transform: `translate3d(-212px, -45px, 0) rotate(${rotation}deg) scale(0.3)`,
        opacity: 0
      } : {
        width: 175,
        height: 156,
        transform: `translate3d(-162px, 5px, 0) rotate(${rotation}deg) scale(1.0)`,
        opacity: idx > 4 && visibleCount >= 3 ? 0 : 1
      }

      return (<Spring
        key={`selection-${sel.type}-${sel.id}`}
        config={isAddingToSpace ? fadeOutConfig : springConfig}
        from={from}
        to={to}
        onRest={() => {
          if (isAddingToSpace) setIsAddingToSpace(false)
        }}>
        { animProps => {
          let aggregateStyle = {
            ...animProps,
            zIndex: 999 - idx
          }

          return (
            <animated.div style={aggregateStyle} className={styles.tile}>
              <div className={styles.image} style={{
                height: `${thumbnailWrapHeight}%`
              }}>
                { thumbnailBounds && (idx === 0 || !isAddingToSpace) && <img style={{
                  width: `${(thumbnailBounds.width / thumbnailWrapBounds.width) * 100}%`,
                  height: `${(thumbnailBounds.height / thumbnailWrapBounds.height) * 100}%`,
                  top: `${((thumbnailBounds.y - thumbnailWrapBounds.y) / bounds.height) * 100}%`,
                  left: `${((thumbnailBounds.x - thumbnailWrapBounds.x) / bounds.width) * 100}%`
                }} src={thumbnail} />}
              </div>
              <div className={styles.meta} style={{ height: `${metaHeight}%` }}>
                <div className={styles.titleBar}>
                  {renderDocIcon(sel.type, iconSrc)}
                  <span className={styles.title}>{title}</span>
                </div>
                { innerMetaText && innerMetaText.length > 1 &&
                <div className={styles.spaceDate}>
                  {innerMetaText[0] || ''} {innerMetaText[1] || ''}
                </div>
                }
              </div>
            </animated.div>
          )
        }}
      </Spring>)
    })
  }

  if (
    (!props.isDropping && !isAddingToSpace) ||
    (props.isDropping && initialMouseCoords.x === 0 && initialMouseCoords.y === 0) ||
    (isAddingToSpace && dropMouseCoords.x === 0 && dropMouseCoords.y === 0)
  ) {
    return null
  }

  return (
    <Fragment>
      { !isAddingToSpace &&
        <div
          className={cx(styles.badge, { [styles.badgeActive]: props.isHovering })}
          style={{
            transform: `translate3d(${props.x + 160}px, ${props.y - 5}px, 0)`
          }}>
          {allDocuments.length}
        </div>
      }

      <div className={styles.tileWrap} style={{
        transform: isAddingToSpace
          ? `translate3d(${dropMouseCoords.x + 160}px, ${dropMouseCoords.y - 5}px, 0)`
          : `translate3d(${props.x + 160}px, ${props.y - 5}px, 0)`
      }}>
        {renderTiles()}
      </div>
    </Fragment>
  )
}

DropSelections.propTypes = {
  isDropping: PropTypes.bool.isRequired,
  isHovering: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  enableFreehandXFilteringSorting: PropTypes.bool,
  externalTypesConfig: PropTypes.object,
  getExtDocFallbackIcon: PropTypes.func
}

DropSelections.defaultProps = {
  isDropping: false,
  isHovering: false,
  x: 0,
  y: 0
}

export default DropSelections
