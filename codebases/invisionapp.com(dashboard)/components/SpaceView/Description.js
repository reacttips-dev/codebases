import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import LinkifyIt from 'linkify-it'
import tlds from 'tlds'

import { Button, Spaced, Text } from '@invisionapp/helios'
import { Draw } from '@invisionapp/helios/icons'
import TextareaAutosize from 'react-textarea-autosize'
import DescriptionCount from './DescriptionCount'

import { DESCRIPTION_CHARACTER_LIMIT } from '../../constants/DescriptionConstants'

import { sanitize } from '../../utils/sanitize'

import styles from '../../css/space/sidebar/description.css'

const linkify = new LinkifyIt()
linkify.tlds(tlds)

const noop = function () {}

const Description = ({
  analyticsSetContext,
  canEdit,
  description,
  isDescriptionEditing,
  isDescriptionSaving,
  isLoading,
  isProject,
  onLinkClicked,
  placeholder,
  startDescriptionEdit,
  stopDescriptionEdit,
  trackEditClickedEvent,
  trackEditCanceledEvent,
  updateDescription
}) => {
  const [text, setText] = useState('')

  const onDescriptionCancel = () => {
    setText(description)
    stopDescriptionEdit()
    if (isProject) {
      trackEditCanceledEvent()
    }
  }

  const onDescriptionChange = e => {
    setText(e.target.value)
  }

  const onDescriptionKeyDown = e => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault()
    }
  }

  const onDescriptionKeyUp = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onDescriptionSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onDescriptionCancel()
    }
  }

  const onDescriptionSave = () => {
    if (isDescriptionSaving || text.length > DESCRIPTION_CHARACTER_LIMIT) return

    const matches = linkify.match(text) || []
    const hasLink = !!matches.length
    analyticsSetContext({
      contentState: text.length > 0 ? 'filled' : 'empty',
      charCount: text.length,
      hasLink: hasLink ? 'yes' : 'no'
    })

    updateDescription(sanitize(text.trim()))
  }

  const onEditClick = e => {
    if (e.target.tagName === 'A') {
      onLinkClicked()
      return
    }

    if (!canEdit) {
      return
    }

    setText(description)
    trackEditClickedEvent()
    startDescriptionEdit(description)
  }

  const parseDescription = descriptionText => {
    const desc = descriptionText.replace('\n', ' ')

    if (desc === '') return desc

    const matches = linkify.match(desc)
    if (!matches) {
      return desc
    }

    const elements = []
    let lastIndex = 0
    matches.forEach((match, i) => {
      // Push precending text if there is any
      if (match.index > lastIndex) {
        elements.push(desc.substring(lastIndex, match.index))
      }

      elements.push(<a key={`description-link-${i}`} href={match.url} target='_blank'>{match.text}</a>)

      lastIndex = match.lastIndex
    })

    // Push remaining text if there is any
    if (desc.length > lastIndex) {
      elements.push(desc.substring(lastIndex))
    }

    return (elements.length === 1) ? elements[0] : elements
  }

  const renderDescriptionEdit = () => {
    return (
      <>
        <div className={styles.textareaWrapper}>
          <Text key='edit' order='body' size='larger'>
            <TextareaAutosize
              autoFocus
              className={cx(styles.textarea, {
                [styles.invalid]: text.length > DESCRIPTION_CHARACTER_LIMIT
              })}
              maxLength={1000}
              maxRows={3}
              onChange={onDescriptionChange}
              onKeyDown={onDescriptionKeyDown}
              onKeyUp={onDescriptionKeyUp}
              placeholder={placeholder}
              value={text}
            />
          </Text>
        </div>

        {renderSaveButtons()}
      </>
    )
  }

  const renderDescription = () => {
    if (isDescriptionEditing) {
      return renderDescriptionEdit()
    }

    let descRender = null

    if (description.trim() !== '') {
      descRender = (
        <Text
          key='filled'
          order='body'
          size='larger'
          className={styles.description}>
          <span>{parseDescription(description)}</span>
        </Text>
      )
    } else if (canEdit) {
      descRender = (
        <Text
          key='empty'
          order='body'
          size='larger'
          color='text-lighter'
          className={styles.placeholder}>
          {placeholder}
          <Spaced left='xs'>
            <Draw
              category='navigation'
              fill='text-lighter'
              size={20}
            />
          </Spaced>
        </Text>
      )
    }

    return (
      <div
        onClick={onEditClick}
        className={cx(styles.descriptionWrapper, { [styles.readonly]: !canEdit })}>
        {descRender}
      </div>
    )
  }

  const renderSaveButtons = () => {
    if (isDescriptionEditing) {
      return (
        <Spaced top='xs'>
          <div className={styles.buttons}>
            <div className={styles.counter}>
              <DescriptionCount
                small={false}
                count={text.length || 0}
              />
            </div>

            <div>
              <Spaced right='xs'>
                <Button
                  order='secondary'
                  role='button'
                  className={styles.cancelButton}
                  onClick={onDescriptionCancel}>
                  Cancel
                </Button>
              </Spaced>

              <Button
                order='primary'
                role='button'
                disabled={isDescriptionSaving || (text.length && text.length > DESCRIPTION_CHARACTER_LIMIT)}
                className={styles.saveButton}
                onClick={onDescriptionSave}>
                Save
              </Button>
            </div>
          </div>
        </Spaced>
      )
    }

    return null
  }

  return (
    <Spaced top='s'>
      <div className={styles.root}>
        { isLoading
          ? <div className={cx(styles.loading, styles.loadingCache, {
            [styles.project]: isProject
          })} />
          : renderDescription() }
      </div>
    </Spaced>
  )
}

Description.propTypes = {
  analyticsSetContext: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  isDescriptionEditing: PropTypes.bool.isRequired,
  isDescriptionSaving: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isProject: PropTypes.bool,
  onLinkClicked: PropTypes.func,
  placeholder: PropTypes.string,
  startDescriptionEdit: PropTypes.func.isRequired,
  stopDescriptionEdit: PropTypes.func.isRequired,
  trackEditClickedEvent: PropTypes.func,
  trackEditCanceledEvent: PropTypes.func,
  updateDescription: PropTypes.func.isRequired
}

Description.defaultProps = {
  canEdit: false,
  description: '',
  isProject: false,
  onLinkClicked: noop,
  placeholder: 'Add a description to this space',
  trackEditClickedEvent: noop,
  trackEditCanceledEvent: noop
}

export default Description
