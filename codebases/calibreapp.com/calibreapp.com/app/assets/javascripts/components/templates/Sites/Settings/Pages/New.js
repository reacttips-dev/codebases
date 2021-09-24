import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../../../Button'
import { Lockup, Section } from '../../../../Layout'
import { Flex, Box } from '../../../../Grid'

import PageFields from './Fields'

const Pages = ({ orgId, onUpdate, onValidating }) => {
  const [pages, setPages] = useState({ 0: { name: '' } })

  const updatePage = page => {
    const updatedPages = { ...pages, ...page }
    setPages(updatedPages)
    onUpdate(updatedPages)
  }

  const onAdd = () => {
    const key = `${Date.now()}${Object.keys(pages).length}`
    const updatedPages = { ...pages, [key]: {} }
    setPages(updatedPages)
  }

  const removePage = key => {
    delete pages[key]
    setPages({ ...pages })
  }

  return (
    <>
      <PageFields
        orgId={orgId}
        onUpdate={updatePage}
        onRemove={removePage}
        onValidating={onValidating}
        onAdd={onAdd}
        pages={pages}
      />
    </>
  )
}

const Page = ({ orgId, loading, onCreate, onCancel }) => {
  const formRef = useRef()
  const [attributes, setAttributes] = useState({})
  const [validating, onValidating] = useState(false)
  const { pages } = attributes

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
  }

  const handleSubmit = event => {
    event.preventDefault()
    onCreate(Object.keys(pages).map(key => pages[key]))
  }

  return (
    <Section>
      <Flex alignItems="center">
        <Box>
          <Lockup id="site.settings.pages.new" mb={0} />
        </Box>
      </Flex>
      <form onSubmit={handleSubmit} ref={formRef} data-qa="pageForm">
        <Pages
          orgId={orgId}
          onUpdate={pages => setAttribute({ pages })}
          onValidating={onValidating}
        />
        <Flex>
          <Box order={2}>
            <Button
              disabled={
                validating || loading || !pages || !Object.keys(pages).length
              }
              loading={loading}
              type="submit"
            >
              <FormattedMessage id="site.settings.pages.actions.save" />
            </Button>
          </Box>
          <Box mr={2} order={1}>
            <Button
              data-testid="pages-settings-cancel"
              onClick={onCancel}
              variant="tertiary"
            >
              <FormattedMessage id="site.actions.cancel" />
            </Button>
          </Box>
        </Flex>
      </form>
    </Section>
  )
}

export default Page
