import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { FieldSet, FieldGroup, Input } from '../../../../Forms'
import { Flex, Box } from '../../../../Grid'
import { AddButton, RemoveButton } from '../../../../Button'
import Feedback from '../../../Feedback'
import { ValidatePage } from '../../../../../queries/PageQueries.gql'
import safeError from '../../../../../utils/safeError'
import { Col } from '../../../../Layout'

export const Page = ({
  orgId,
  id,
  onUpdate,
  onRemove,
  onAdd,
  onValidating,
  loading,
  name: initialName,
  url: initialUrl
}) => {
  const [attributes, setAttributes] = useState({
    name: initialName,
    url: initialUrl
  })
  const [feedback, setFeedback] = useState()

  useEffect(() => {
    setAttributes({ name: initialName, url: initialUrl })
  }, [loading, initialName, initialUrl])

  const [validatePageMutation] = useMutation(ValidatePage, {
    onCompleted: ({ validatePage: { warningMessage } }) => {
      onValidating(false)
      if (warningMessage) {
        setFeedback({
          type: 'warning',
          message: (
            <>
              {warningMessage}{' '}
              <a
                href="/docs/features/agent#recognising-the-calibre-agent"
                target="_blank"
              >
                See Agent documentation
              </a>
            </>
          )
        })
      } else {
        setFeedback({
          type: 'success',
          message: 'Valid URL'
        })
      }
    },
    onError: error => {
      onValidating(false)
      if (error)
        setFeedback({
          type: 'error',
          message: safeError(error)
        })
    }
  })
  const { name, url } = attributes

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
    onUpdate({ [id]: updatedAttributes })
  }

  const setUrl = url => {
    setAttribute({ url })
    if (/^(http|https):\/\/[^ "]+$/.test(url)) {
      // Only validate on the back-end if we have a valid URL on the front-end
      onValidating(true)
      validatePageMutation({
        variables: {
          orgId,
          attributes: { name: 'New Page', url }
        }
      })
    } else if (url && url.length) {
      setFeedback({
        type: 'error',
        message: `'${url}' is not a valid URL`
      })
    }
  }

  const handleRemove = event => {
    event.preventDefault()
    onRemove(id)
  }

  const handleAdd = event => {
    event.preventDefault()
    onAdd()
  }

  return (
    <Box pb={[4, 4, 0]} data-testid="page-fields">
      <FieldSet mb={0}>
        <FieldGroup label="Page name">
          <Input
            name="page_name"
            defaultValue={name}
            required={true}
            maxLength={120}
            onBlur={name => setAttribute({ name })}
            placeholder="Page name"
            loading={loading}
          />
        </FieldGroup>
        <FieldGroup
          label="URL"
          help="The fully qualified URL to your page, without any redirects."
        >
          <Input
            name="page_url"
            type="url"
            defaultValue={url}
            required={true}
            maxLength={2400}
            onBlur={url => setUrl(url)}
            onChange={() => setFeedback()}
            onFocus={() => {
              onValidating(true)
              setFeedback()
            }}
            placeholder="Page URL"
            inputStyle={(feedback && feedback.type) || 'base'}
            loading={loading}
          />
        </FieldGroup>
        {onAdd || onRemove ? (
          <FieldGroup mt={[0, 0, 34]}>
            <Flex>
              {!onRemove || (
                <Box>
                  <RemoveButton
                    onClick={handleRemove}
                    title="Remove this page"
                  />
                </Box>
              )}
              {!onAdd || (
                <Box ml={2}>
                  <AddButton onClick={handleAdd} title="Add another page" />
                </Box>
              )}
            </Flex>
          </FieldGroup>
        ) : null}
      </FieldSet>
      {!feedback || !!(feedback.type === 'success') || (
        <FieldSet mb={0}>
          <Col span={2}>
            <Feedback p={0} duration={0} {...feedback} />
          </Col>
        </FieldSet>
      )}
    </Box>
  )
}

const Pages = ({
  orgId,
  onAdd,
  onUpdate,
  onRemove,
  pages,
  loading,
  onValidating
}) => {
  const keys = Object.keys(pages)
  return keys.map(key => {
    const page = pages[key]
    return (
      <Page
        key={key}
        orgId={orgId}
        id={key}
        onRemove={key === '0' ? null : onRemove}
        onAdd={key === keys[keys.length - 1] ? onAdd : null}
        onUpdate={onUpdate}
        onValidating={onValidating}
        loading={loading}
        {...page}
      />
    )
  })
}

export default Pages
