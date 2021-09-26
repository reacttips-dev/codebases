import React from 'react'

import InlineNav from '../../../components/InlineNav'

const Nav = ({ path, query, loading, measurements }) => {
  const getMetric = name =>
    (measurements || []).find(measurement => measurement.name === name) || {
      value: loading ? <span>&emsp;</span> : 'n/a'
    }
  const lhPerfScore = getMetric('lighthouse-performance-score')
  const thirdPartyCount = getMetric('third_party_count')
  const lhPwaScore = getMetric('lighthouse-pwa-score')
  const lhAccessibilityScore = getMetric('lighthouse-accessibility-score')
  const lhBestPractricesScore = getMetric('lighthouse-best-practices-score')
  const lhSeoScore = getMetric('lighthouse-seo-score')

  const itemPath = current =>
    `${path}${current.length ? `/${current}` : ''}${query ? `?${query}` : ''}`

  const items = [
    {
      path: itemPath(''),
      label: 'Overview'
    },
    {
      path: itemPath('performance'),
      label: 'Performance',
      meta: (
        <span data-testid="test-nav-performance-value" className="badge">
          {lhPerfScore.value}
        </span>
      )
    },
    {
      path: itemPath('third-parties'),
      label: 'Third Party',
      meta: (
        <span data-testid="test-nav-third-parties-value" className="badge">
          {thirdPartyCount.value}
        </span>
      )
    },
    {
      path: itemPath('pwa'),
      label: 'PWA',
      meta: (
        <span data-testid="test-nav-pwa-value" className="badge">
          {lhPwaScore.value}
        </span>
      )
    },
    {
      path: itemPath('best-practices'),
      label: 'Best Practices',
      meta: (
        <span data-testid="test-nav-best-practices-value" className="badge">
          {lhBestPractricesScore.value}
        </span>
      )
    },
    {
      path: itemPath('accessibility'),
      label: 'Accessibility',
      meta: (
        <span data-testid="test-nav-accessibility-value" className="badge">
          {lhAccessibilityScore.value}
        </span>
      )
    },
    {
      path: itemPath('seo'),
      label: 'SEO',
      meta: (
        <span data-testid="test-nav-seo" className="badge">
          {lhSeoScore.value}
        </span>
      )
    }
  ]

  return <InlineNav items={items} />
}

export default Nav
