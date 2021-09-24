import React, { Suspense, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import {
  ListPages,
  UpdatePage,
  DeletePage
} from '../../queries/PageQueries.gql'
import PagesTemplate from '../../components/templates/Sites/Settings/Pages'
import PageTitle from '../../components/PageTitle'
import useFeedback from '../../hooks/useFeedback'
import safeError from '../../utils/safeError'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))
const ErrorHandler = React.lazy(() =>
  import('../../components/templates/ErrorHandler')
)

const Pages = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const [searchTerm, setSearchTerm] = useState('')
  const intl = useIntl()

  const pagesVariables = {
    teamId,
    siteId,
    pagesFilter: { nameContains: searchTerm },
    count: 20
  }

  const { loading, data, fetchMore, error } = useQuery(ListPages, {
    variables: pagesVariables,
    fetchPolicy: 'cache-and-network'
  })

  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name: siteName, pagesList } = site || {}
  const { edges, pageInfo } = pagesList || {}

  const [updatePageMutation] = useMutation(UpdatePage, {
    onError: error =>
      setFeedback({
        location: 'pages',
        type: 'error',
        message: safeError(error)
      })
  })
  const [deletePageMutation] = useMutation(DeletePage, {
    onCompleted: () =>
      setFeedback({
        location: 'pages',
        type: 'success',
        message: intl.formatMessage({
          id: 'site.settings.pages.delete.success'
        })
      }),
    onError: error =>
      setFeedback({
        location: 'pages',
        type: 'error',
        message: safeError(error)
      })
  })

  const deletePage = ({ page }) =>
    deletePageMutation({
      variables: { orgId, siteId, uuid: page },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePage: {
          id: page,
          __typename: 'Page',
          deleted: true
        }
      }
    })

  const updatePagePosition = ({ page, position }) =>
    updatePageMutation({
      variables: { orgId, siteId, uuid: page, attributes: { position } }
    })

  const pages = (edges || []).map(edge => {
    const { previewImage, ...page } = edge.node
    return {
      ...page,
      previewImage: previewImage ? previewImage.url : null
    }
  })

  const nextPage = () => {
    fetchMore({
      variables: {
        cursor: pageInfo.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          team: {
            ...prev.team,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            site: {
              ...prev.team.site,
              pagesList: {
                ...prev.team.site.pagesList,
                edges: [
                  ...prev.team.site.pagesList.edges,
                  ...fetchMoreResult.team.site.pagesList.edges
                ],
                pageInfo: fetchMoreResult.team.site.pagesList.pageInfo
              }
            }
          }
        })
    })
  }

  if (error)
    return (
      <Suspense>
        <ErrorHandler error={error} />
      </Suspense>
    )

  return (
    <>
      <PageTitle id="pages.title" breadcrumbs={[siteName, organisationName]} />
      {(feedback.location === 'pages' && (
        <Suspense fallback={<div />}>
          <Feedback
            p={0}
            px={4}
            pt={4}
            duration={0}
            onDismiss={clearFeedback}
            {...feedback}
          />
        </Suspense>
      )) ||
        null}
      <PagesTemplate
        loading={loading}
        teamId={teamId}
        siteId={siteId}
        pages={pages}
        pageInfo={pageInfo}
        onNext={nextPage}
        onUpdatePosition={updatePagePosition}
        onDelete={deletePage}
        onSearch={setSearchTerm}
      />
    </>
  )
}

export default Pages
