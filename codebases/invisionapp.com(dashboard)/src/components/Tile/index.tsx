import React, { forwardRef, useState, Ref, ReactNode, useMemo } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import Empty from './Empty'
import Dropdown from '../Dropdown'
import IconButton from '../IconButton'
import Text from '../../primitives/Text'
import DocumentIcon from '../DocumentIcon'
import Truncate from '../Truncate'
import Icon from '../../primitives/Icon'
import { DocumentType } from '../../types'
import { MenuItem } from '../Menu/types'
import Box from '../Box'
import Badge from '../Badge'

export interface TileProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The path to the document image, if there is one.
   */
  imageSrc?: string
  /**
   * The type of document the Tile is representing.
   */
  documentType?: DocumentType
  /**
   * If using a custom DocumentIcon, use this rather than the documentType prop
   */
  documentTypeSrc?: string
  /**
   * The URL to the document.
   */
  href: string
  /**
   * The title of the Tile.
   */
  title: string
  /**
   * Render prop that should return the name of the space, or the Add to Space call to action.
   */
  renderSpace?: (props: TileProps) => ReactNode
  /**
   * The last viewed/updated/edited timestamp.
   */
  timestamp: string
  /**
   * If true, a Badge will be displayed on the Tile alerting the user.
   */
  isTemplate?: boolean
  /**
   * The links to render within the meatball menu within the Tile.
   */
  menuItems?: MenuItem[]
  /**
   * If true, the TIle will appear selected. Can only be used if isSelectable=true.
   */
  isSelected?: boolean
  /**
   * If true, the Tile will be in a selectable state. All interactivity will be prevented.
   */
  isSelectable?: boolean
  /**
   * Callback that fires when a user clicks on a selectable Tile
   */
  onSelectionClick?: () => void
}

/**
 * Tiles display document information, and also link to the specified artifact.
 */
const Tile = forwardRef(function Tile(
  props: TileProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    href,
    imageSrc,
    title,
    documentType,
    documentTypeSrc,
    timestamp,
    isTemplate,
    menuItems,
    isSelected,
    isSelectable,
    onSelectionClick,
    onClick,
    renderSpace,
    ...rest
  } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps<
    HTMLAnchorElement
  >(props)
  const [imageOrientation, setImageOrientation] = useState<
    'portrait' | 'landscape'
  >()

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    const ratio = img.naturalHeight / img.naturalWidth
    const orientation = ratio > 0.75 ? 'portrait' : 'landscape'

    setImageOrientation(orientation)
  }

  const [isOpen, setIsOpen] = useState(false)

  const randomNumber = useMemo(() => {
    return Math.floor(Math.random() * 8)
  }, [])

  const imageType =
    documentType && ['rhombus', 'board', 'freehand'].includes(documentType)
      ? 'full'
      : 'regular'
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-tile hds-transition-on-hover', className, {
        'hds-focus-visible': focusVisible,
        'hds-tile-is-selectable': isSelectable,
        'hds-tile-is-selected': isSelected,
      })}
    >
      <article className="hds-tile-contents">
        <a
          href={href}
          className="hds-tile-link"
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <figure className="hds-tile-figure">
            {imageSrc ? (
              <img
                className={cx('hds-tile-image', {
                  'hds-tile-image-is-loaded': imageOrientation,
                  'hds-tile-image-portrait':
                    imageOrientation === 'portrait' && imageType === 'regular',
                  'hds-tile-image-landscape':
                    imageOrientation === 'landscape' && imageType === 'regular',
                  'hds-tile-image-full': imageType === 'full',
                })}
                src={imageSrc}
                onLoad={handleImageLoad}
                alt={title}
              />
            ) : (
              <Empty
                className={cx('hds-tile-empty', {
                  [`hds-tile-empty-${randomNumber}`]: randomNumber,
                })}
              />
            )}

            {isTemplate && <Badge className="hds-tile-badge">Template</Badge>}
          </figure>
        </a>
        <Box
          className="hds-tile-text"
          alignItems="center"
          justifyContent="start"
          flexWrap="no-wrap"
        >
          <DocumentIcon
            className="hds-tile-document-icon"
            documentType={documentType}
            src={documentTypeSrc}
            size="32"
          />
          <div className="hds-tile-info">
            <Text size="heading-14" color="surface-100">
              <Truncate
                className="hds-tile-title"
                placement="end"
                title={title}
              >
                {title}
              </Truncate>
            </Text>
            <div className="hds-tile-meta">
              {renderSpace && (
                <Text
                  size="body-12"
                  color="surface-80"
                  className="hds-tile-space"
                >
                  <div className="hds-tile-space-contents">
                    {renderSpace(props)}
                  </div>
                </Text>
              )}

              <Text
                size="body-12"
                color="surface-80"
                className={cx('hds-tile-timestamp', {
                  'hds-tile-timestamp-without-dot': !renderSpace,
                })}
              >
                {timestamp}
              </Text>
            </div>
          </div>
          {menuItems && (
            <Dropdown
              items={menuItems}
              isOpen={isOpen}
              onChangeVisibility={setIsOpen}
              triggerNode={
                <IconButton
                  as="span"
                  className="hds-tile-icon-button"
                  tabIndex={-1}
                >
                  <Icon name="More" size="24" color="surface-50" isDecorative />
                </IconButton>
              }
              placement="top-right"
              aria-label="Document options"
              focusManager="modeless"
            />
          )}
        </Box>
      </article>
      {isSelectable && (
        <button
          onClick={onSelectionClick}
          className="hds-tile-selectable-overlay"
          aria-label="Toggle selection state for this Tile"
        />
      )}
    </div>
  )
})

export default Tile
