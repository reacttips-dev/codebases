import React from 'react'

import PageTitle from '../../components/PageTitle'
import { Banner, Section } from '../../components/Layout'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Box } from '../../components/Grid'

import { FormattedMessage } from 'react-intl'

import PersonalDetails from '../../components/templates/User/Profile/PersonalDetails'
import Authentication from '../../components/templates/User/Profile/Authentication'
import DeleteAccount from '../../components/templates/User/Profile/DeleteAccount'

const UserProfile = () => {
  return (
    <>
      <PageTitle id="you.settings.profile.title" />
      <Banner>
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage id="you.settings.profile.heading" />
          </Breadcrumbs>
        </Box>
      </Banner>
      <Section p={null} px={4} pt={4}>
        <PersonalDetails />
      </Section>
      <Section pt={4}>
        <Authentication />
      </Section>
      <Section pt={4}>
        <DeleteAccount />
      </Section>
    </>
  )
}

export default UserProfile
