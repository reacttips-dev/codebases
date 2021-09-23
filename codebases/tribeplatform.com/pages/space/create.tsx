import React from 'react'

import { CreateSpaceContainer } from 'containers/Space/CreateSpaceContainer'

const CreateSpacePage = () => <CreateSpaceContainer />

CreateSpacePage.getInitialProps = async () => ({
  props: { namespacesRequired: ['common', 'settings'] },
  seo: {
    title: 'Create space',
    appendNetworkName: true,
  },
})

CreateSpacePage.options = {
  permissionScopes: ['addSpace'],
}

export default CreateSpacePage
