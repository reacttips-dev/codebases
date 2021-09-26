import React, { useState } from 'react'

import Tabs, { TabList, Tab } from '../../../Tabs'
import Breadcrumbs from '../../../Breadcrumbs'
import { Section } from '../../../Layout'
import { Flex, Box } from '../../../Grid'
import Feedback from '../../Feedback'
import useFeedback from '../../../../hooks/useFeedback'

const Header = ({ onChangeRoute, routeIndex }) => {
  const [tabIndex, setTabIndex] = useState(routeIndex)
  const { feedback, clearFeedback } = useFeedback()

  const handleChange = index => {
    onChangeRoute(index)
    setTabIndex(index)
  }

  return (
    <>
      <Section>
        <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
          <Box flex={1} mb={[4, 0]}>
            <Breadcrumbs>Billing</Breadcrumbs>
          </Box>
        </Flex>
      </Section>
      <Tabs index={tabIndex} onChange={handleChange}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Payment Method</Tab>
          <Tab>Receipt History and Settings</Tab>
        </TabList>
      </Tabs>
      {(feedback.location === 'billing' && (
        <Feedback
          data-qa="billingFeedback"
          p={null}
          pt={4}
          px={4}
          pb={0}
          duration={0}
          onDismiss={clearFeedback}
          {...feedback}
        />
      )) ||
        null}
    </>
  )
}

export default Header
