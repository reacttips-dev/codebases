import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import Pagination from '../../../../Pagination'
import { Flex, Box } from '../../../../Grid'
import { Section } from '../../../../Layout'
import { Search } from '../../../../Forms'
import Button, { ExternalLinkButton } from '../../../../Button'
import Text, { Heading, TruncatedText } from '../../../../Type'
import { Reorder, Edit, Delete } from '../../../../Actions'
import CopyableText from '../../../../CopyableText'
import { LoadingLayout } from '../../../../Loading'
import {
  ResourceList,
  ResourceItem,
  ResourcePreview,
  ResourceBody,
  ResourceActions,
  ResourceTitle
} from '../../../../ResourceList'

const Pages = ({
  loading,
  teamId,
  siteId,
  pages: initialPages,
  pageInfo,
  onNext,
  onDelete,
  onUpdatePosition,
  onSearch
}) => {
  const confirmText = 'DELETE'
  const [pages, setPages] = useState(initialPages)

  const onReorder = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const [removed] = pages.splice(result.source.index, 1)
    pages.splice(result.destination.index, 0, removed)

    setPages(pages)
    onUpdatePosition({
      page: removed.uuid,
      position: result.destination.index + 1
    })
  }

  useEffect(() => {
    if (initialPages.length != pages.length) return setPages(initialPages)

    initialPages.forEach(initialPage => {
      const page = pages.find(p => p.uuid === initialPage.uuid)
      if (!page) {
        return setPages(initialPages)
      }
    })
  }, [initialPages])

  return (
    <>
      <Section borderBottom="none">
        <Flex alignItems="center" flexWrap={['wrap', 'nowrap']}>
          <Box mr={4} mb={[2, 0]}>
            <Heading as="h2" level="sm">
              <FormattedMessage id="site.settings.pages.title" />
            </Heading>
          </Box>
          <Box width={[1, 270]} order={[3, 2]}>
            <FormattedMessage id="site.settings.pages.actions.search">
              {label => (
                <Search onChange={onSearch} placeholder={label} width={1} />
              )}
            </FormattedMessage>
          </Box>
          <Box ml="auto" order={[2, 3]} mb={[2, 0]}>
            <Button to={`/teams/${teamId}/${siteId}/settings/pages/new`}>
              <FormattedMessage id="site.settings.pages.actions.add" />
            </Button>
          </Box>
        </Flex>
      </Section>
      {pages.length ? (
        <ResourceList onReorder={onReorder}>
          {pages
            .filter(({ deleted }) => !deleted)
            .map(({ uuid, name, previewImage, url }, index) => (
              <ResourceItem key={uuid} id={uuid} index={index}>
                {provided => (
                  <>
                    {previewImage ? (
                      <ResourcePreview name={name} src={previewImage} />
                    ) : null}
                    <ResourceBody>
                      <ResourceTitle>{name}</ResourceTitle>
                      <Box mb="8px">
                        <ExternalLinkButton href={url} level="xs">
                          {url}
                        </ExternalLinkButton>
                      </Box>
                      <Box>
                        <CopyableText prompt="Copy UUID" text={uuid}>
                          <TruncatedText level="xs">{uuid}</TruncatedText>
                        </CopyableText>
                      </Box>
                    </ResourceBody>
                    <ResourceActions>
                      <Box mr={4}>
                        <Reorder {...provided.dragHandleProps} />
                      </Box>
                      <Box>
                        <Edit
                          to={`/teams/${teamId}/${siteId}/settings/pages/${uuid}/edit`}
                        />
                      </Box>
                      {pages.length <= 1 || (
                        <Box ml={4}>
                          <FormattedMessage
                            id="site.settings.pages.delete.prompt"
                            values={{ confirmText }}
                          >
                            {message => (
                              <Delete
                                onClick={() => {
                                  const response = prompt(message)
                                  if (response === confirmText) {
                                    onDelete({ page: uuid })
                                  }
                                }}
                              />
                            )}
                          </FormattedMessage>
                        </Box>
                      )}
                    </ResourceActions>
                  </>
                )}
              </ResourceItem>
            ))}
        </ResourceList>
      ) : loading ? (
        <Section>
          <LoadingLayout />
        </Section>
      ) : (
        <Section>
          <Text>
            <FormattedMessage id="pages.empty" />
          </Text>
        </Section>
      )}
      {loading ? null : (
        <Flex>
          <Box mx="auto">
            <Pagination pageInfo={pageInfo} onNext={onNext} />
          </Box>
        </Flex>
      )}
    </>
  )
}

export default Pages
