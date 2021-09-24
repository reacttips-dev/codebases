import React, { Suspense } from 'react'
import queryString from 'query-string'
import { useQuery } from '@apollo/client'

import { LoadingLayout } from '../components/Loading'
import { FormattedDateString } from '../components/FormattedDate'
import { ExternalLinkButton } from '../components/Button'
import { ChevronRightIcon } from '../components/Icon'
import PageTitle from '../components/PageTitle'
import MetadataList from '../components/MetadataList'
import SnapshotSwitcher from '../components/SnapshotSwitcher'
import PageSwitcher from '../components/PageSwitcher'
import ProfileSwitcher from '../components/ProfileSwitcher'
import { Section } from '../components/Layout'
import { Flex, Box } from '../components/Grid'

import Menu from '../components/templates/Snapshot/Menu'
import Template from '../components/templates/Snapshot'
import Incomplete from '../components/templates/Snapshot/Incomplete'

import { GetSnapshotInfo } from '../queries/SnapshotQueries.gql'

const ErrorHandler = React.lazy(() =>
  import('../components/templates/ErrorHandler')
)

const Snapshot = ({
  match: { params, url },
  location: { search },
  history
}) => {
  const { teamId, siteId, snapshotId: iid } = params
  const { page: pageUuid, profile: profileUuid } = queryString.parse(search)

  const navigate = ({
    page = pageUuid,
    profile = profileUuid,
    snapshotId = iid
  }) => {
    history.push({
      pathname: `/teams/${teamId}/${siteId}/snapshots/${snapshotId}`,
      search: `?${queryString.stringify({
        page,
        profile
      })}`
    })
  }

  const snapshotId = Number(iid)
  const { data, loading, stopPolling, error } = useQuery(GetSnapshotInfo, {
    variables: {
      teamId,
      siteId,
      snapshotId,
      page: pageUuid,
      profile: profileUuid
    },
    pollInterval: 5000
  })

  if (loading) return <LoadingLayout />

  if (error)
    return (
      <Suspense fallback={<div />}>
        <ErrorHandler error={error} />
      </Suspense>
    )

  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName } = organisation || {}
  const { name: siteName, snapshot, testProfiles, page } = site || {}
  const { test } = snapshot || {}
  const { status } = test || {}

  if (!test || ['completed', 'errored'].includes(status)) {
    stopPolling()
  }

  let metadataList = [
    FormattedDateString({
      prefix: 'Created',
      date: snapshot && snapshot.createdAt
    })
  ]

  if (snapshot && snapshot.ref) metadataList.push(`Ref: ${snapshot.ref}`)

  if (page) {
    metadataList.push(
      <>
        <ExternalLinkButton key={page.uuid} href={page.url}>
          View tested page
        </ExternalLinkButton>
      </>
    )
  }

  return (
    <>
      <PageTitle
        id="snapshot.title"
        values={{ id: snapshotId }}
        breadcrumbs={[siteName, organisationName]}
      />
      <Section>
        <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
          <Box flex={1} mb={[4, 0]}>
            <Flex flexWrap={['wrap', 'nowrap']}>
              <Box fontSize="20px">
                <SnapshotSwitcher
                  teamId={teamId}
                  siteId={siteId}
                  onApply={navigate}
                  selectedSnapshot={snapshot}
                />
              </Box>
              <Box mx={2} pt="3px">
                <ChevronRightIcon color="grey300" />
              </Box>
              <Box fontSize="20px">
                <PageSwitcher
                  teamId={teamId}
                  siteId={siteId}
                  onApply={navigate}
                  selectedPage={page}
                />
              </Box>
              <Box mx={2} pt="3px">
                <ChevronRightIcon color="grey300" />
              </Box>
              <Box fontSize="20px">
                <ProfileSwitcher
                  onApply={navigate}
                  selectedProfile={profileUuid}
                  profiles={testProfiles}
                />
              </Box>
            </Flex>
          </Box>
          <Box width={[1, 'auto']} my="-8px">
            <Menu
              teamId={teamId}
              siteId={siteId}
              snapshotId={snapshotId}
              pageUuid={pageUuid}
              profileUuid={profileUuid}
              history={history}
            />
          </Box>
        </Flex>
        <Box mt={1}>
          <MetadataList items={metadataList} />
        </Box>
      </Section>
      {!test ? (
        <Incomplete status="not_found" />
      ) : [
          'created',
          'scheduled',
          'running',
          'processing',
          'verifying',
          'failed',
          'not_found'
        ].includes(status) ? (
        <Incomplete status={status} />
      ) : (
        <Template
          teamId={teamId}
          siteId={siteId}
          snapshotId={snapshotId}
          pageUuid={pageUuid}
          profileUuid={profileUuid}
          url={url}
        />
      )}
    </>
  )
}

export default Snapshot
