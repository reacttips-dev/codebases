import React from 'react'

import ScoreCard from '../ScoreCard'
import LoadingLine from './Line'

const LoadingScoreCard = () => (
  <ScoreCard type="error">
    <LoadingLine width="365px" my={2} />
    <LoadingLine width="89px" height="44px" my={2} />
    <LoadingLine width="365px" />
  </ScoreCard>
)

export default LoadingScoreCard
