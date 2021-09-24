import React from 'react'
import { Link } from 'react-router-dom'

import BlankSlate from '../../BlankSlate'
import ScoreCard from '../../ScoreCard'
import { Row, Col } from '../../Layout'
import { LoadingScoreCard } from '../../Loading'

import Title from './Title'
import { BADGE_STATUS_TYPES, DEFAULT_STATUS_ORDER } from './statusTypes'

const Budget = ({ teamId, siteId, uuid, status, ...props }) => (
  <ScoreCard type={BADGE_STATUS_TYPES[status]} p={0}>
    <Link to={`/teams/${teamId}/${siteId}/budgets/${uuid}`}>
      <Title status={status} {...props} compact={true} />
    </Link>
  </ScoreCard>
)

const Budgets = ({ teamId, siteId, loading, site, budgets, filter }) => {
  if (!loading && !budgets.length)
    return (
      <BlankSlate id={`budgets.${filter}`} offset={190} offsets={[317, 190]} />
    )

  return (
    <Row
      gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
      gridColumnGap={3}
      pt={3}
    >
      {loading ? (
        <LoadingScoreCard />
      ) : (
        budgets
          .sort(
            (a, b) =>
              DEFAULT_STATUS_ORDER.indexOf(a.status) -
              DEFAULT_STATUS_ORDER.indexOf(b.status)
          )
          .map(budget => (
            <Col key={budget.uuid} mb={3}>
              <Budget teamId={teamId} siteId={siteId} site={site} {...budget} />
            </Col>
          ))
      )}
    </Row>
  )
}

Budgets.defaultProps = {
  filters: 'all'
}

export default Budgets
