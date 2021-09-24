import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import Button from '../../../../Button'
import {
  FieldSet,
  FieldGroup,
  Checkbox,
  Select,
  Input
} from '../../../../Forms'
import { Flex, Box } from '../../../../Grid'
import { Section, Lockup } from '../../../../Layout'
import { Text } from '../../../../Type'

import Headers from '../../../Headers'
import Cookies from '../../../Cookies'
import ThirdParties from './ThirdParties'

import bytesToTransferRate from '../../../../../utils/bytesToTransferRate'

import { LinkedData } from '../../../../../queries/TestProfileQueries.gql'

const TestProfile = ({
  orgId,
  siteId,
  onSave,
  onCancel,
  saving,
  loading,
  ...initialFormState
}) => {
  const intl = useIntl()
  const [attributes, setAttributes] = useState(initialFormState)

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
  }

  useEffect(() => {
    setAttributes(initialFormState)
  }, [loading])

  const {
    name,
    device,
    connection,
    jsIsDisabled,
    adBlockerIsEnabled,
    headers,
    cookies,
    blockedThirdParties
  } = attributes

  const handleSubmit = event => {
    event.preventDefault()
    onSave({
      name,
      device,
      connection,
      jsIsDisabled,
      adBlockerIsEnabled,
      headers,
      cookies,
      blockedThirdParties: blockedThirdParties.map(({ name }) => ({
        name
      }))
    })
  }

  const updateBlockedThirdParty = thirdParty => {
    let updatedThirdParties = Object.assign([], blockedThirdParties)
    if (
      blockedThirdParties.find(
        blockedThirdParty => blockedThirdParty.name === thirdParty.name
      )
    ) {
      updatedThirdParties = blockedThirdParties.filter(
        blockedThirdParty => blockedThirdParty.name !== thirdParty.name
      )
    } else {
      updatedThirdParties.push(thirdParty)
    }
    setAttributes({
      ...attributes,
      blockedThirdParties: updatedThirdParties
    })
  }

  const { loading: loadingLinkedData, data } = useQuery(LinkedData, {
    variables: { orgId, siteId }
  })

  const {
    devices: deviceList = {},
    connections: connectionsList = [],
    organisation
  } = data || {}
  const { site } = organisation || {}
  const {
    siteThirdParties: siteThirdPartiesList,
    headers: siteHeaders,
    cookies: siteCookies
  } = site || {}
  const { edges } = siteThirdPartiesList || {}

  const siteThirdParties = (edges || []).map(edge => ({ ...edge.node }))

  const { enumValues } = deviceList || {}
  const devices =
    (enumValues || []).map(({ description, name }) => ({
      label: intl.formatMessage({
        id: `device.${name}.title`,
        defaultMessage: description
      }),
      value: name
    })) || []

  const connections =
    connectionsList
      .slice()
      .sort((connA, connB) => connA.download - connB.download)
      .map(({ id, title, latency, download, upload }) => {
        let label = `${title}`
        const data = []
        if (latency) data.push(`Latency: ${latency}ms`)
        if (download) data.push(`Downstream: ${bytesToTransferRate(download)}`)
        if (upload) data.push(`Upstream: ${bytesToTransferRate(upload)}`)
        if (data.length) label = label + ` (${data.join(', ')})`
        return {
          label,
          value: id
        }
      }) || []

  return (
    <form onSubmit={handleSubmit}>
      <Section p={0} px={4}>
        <FieldSet mb={0}>
          <FieldGroup label="Name">
            <Input
              name="profile_name"
              defaultValue={name}
              required={true}
              maxLength={120}
              onChange={name => setAttribute({ name })}
              placeholder="Mobile with fast connection"
              loading={loading}
            />
          </FieldGroup>
          <FieldGroup label="Device emulation">
            <Select
              name="profile_device"
              defaultValue={device}
              options={devices}
              onChange={device => setAttribute({ device })}
              loading={loading || loadingLinkedData}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet mb={0}>
          <FieldGroup label="Connection speed" span={2}>
            <Select
              name="profile_connection"
              defaultValue={connection}
              options={connections}
              onChange={connection => setAttribute({ connection })}
              loading={loading || loadingLinkedData}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet mb={0}>
          <FieldGroup mb="15px">
            <Checkbox
              id="profile_jsIsDisabled"
              name="profile_jsIsDisabled"
              defaultChecked={jsIsDisabled}
              value="javascript"
              onChange={() =>
                setAttribute({
                  jsIsDisabled: !jsIsDisabled
                })
              }
            >
              <span data-qa="jsIsDisabled">
                <FormattedMessage id="testProfile.jsIsDisabled.action" />
              </span>
            </Checkbox>
          </FieldGroup>
        </FieldSet>

        <FieldSet mb={0}>
          <FieldGroup>
            <Checkbox
              id="profile_adBlockerIsEnabled"
              name="profile_adBlockerIsEnabled"
              defaultChecked={adBlockerIsEnabled}
              value="adBlockerIsEnabled"
              onChange={() =>
                setAttribute({
                  adBlockerIsEnabled: !adBlockerIsEnabled
                })
              }
            >
              <span data-qa="adBlockerIsEnabled">
                <FormattedMessage id="testProfile.adblocker.action" />
              </span>
            </Checkbox>
          </FieldGroup>
        </FieldSet>
      </Section>

      <Section>
        <Lockup id="site.settings.profiles.headers" mb={0} />
        <Headers
          loading={loading}
          parentHeaders={siteHeaders}
          headers={headers}
          onUpdate={headers => setAttributes({ ...attributes, headers })}
          buttonVariant="tertiary"
        />
      </Section>

      <Section>
        <Lockup id="site.settings.profiles.cookies" mb={0} />
        <Cookies
          loading={loading}
          parentCookies={siteCookies}
          cookies={cookies}
          onUpdate={cookies => setAttributes({ ...attributes, cookies })}
          buttonVariant="tertiary"
        />
      </Section>

      <Section borderBottom="none">
        <Lockup id="site.settings.profiles.thirdParties.lockup">
          <Text>
            {loading
              ? ' '
              : (siteThirdParties.length && (
                  <FormattedMessage id="site.settings.profiles.thirdParties.description" />
                )) || (
                  <FormattedMessage id="site.settings.profiles.thirdParties.empty" />
                )}
          </Text>
        </Lockup>
        <ThirdParties
          loading={loading}
          thirdParties={siteThirdParties}
          blockedThirdParties={blockedThirdParties}
          onUpdate={updateBlockedThirdParty}
        />
      </Section>

      <Section>
        <Flex>
          <Box order={2}>
            <Button disabled={saving} type="submit">
              <FormattedMessage id="site.settings.profiles.actions.save" />
            </Button>
          </Box>
          <Box mr={2} order={1}>
            <Button
              type="button"
              data-testid="pages-settings-cancel"
              onClick={onCancel}
              variant="tertiary"
            >
              <FormattedMessage id="site.actions.cancel" />
            </Button>
          </Box>
        </Flex>
      </Section>
    </form>
  )
}

TestProfile.defaultProps = {
  jsIsDisabled: false,
  adBlockerIsEnabled: false,
  headers: [],
  cookies: [],
  blockedThirdParties: []
}

export default TestProfile
