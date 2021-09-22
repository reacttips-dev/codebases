import React from 'react'
import useSubFeature from '@invisionapp/runtime-provided-resources/use-sub-feature'
import * as helios from '@invisionapp/helios'
// For local testing in lieu of publishing a new RPR version
// import Editor from '@invisionapp/raas-component'

const peerDependencies = {
  '@invisionapp/helios': {
    dependency: helios,
    // Version of @invisionapp/helios used by home-ui, which is currently the
    // only host-feature that loads global-search-ui.
    version: '6.5.1'
  }
}

function PagesContainer ({ pageId }) {
  const { subFeature: Pages, loading, error } = useSubFeature({
    subFeatureName: 'pages-ui-v2',
    peerDependencies
  })

  if (loading || !pageId) {
    return <div>Loading...</div>
  }

  if (error || !Pages) {
    return <div>Error loading sub feature</div>
  }

  return (
    <div id='pages-app' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <Pages pageId={pageId} scrollingContainer='#pages-app' />
    </div>
  )
}

export default PagesContainer
