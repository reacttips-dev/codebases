/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React from 'react'
import { defineMessages } from 'react-intl'
import DocLink from '../../../components/DocLink'

import { isFleetServerAvailable } from '../../stackDeployments/fleet'

import { DynamicSliderInstanceDefinition, DynamicSliderInstanceDefinitionParams } from '../types'

const definition: DynamicSliderInstanceDefinition = [
  {
    messages: defineMessages({
      prettyName: {
        id: `sliders.apm.prettyName`,
        defaultMessage: `APM`,
      },
      description: {
        id: `sliders.apm.description`,
        defaultMessage: `Application Performance Monitoring (APM) collects in-depth performance metrics and errors from inside your application. Configure your APM Server and Agent next.`,
      },
      deploymentTemplateDescription: {
        id: `sliders.apm.deploymentTemplateDescription`,
        defaultMessage: `APM (Application Performance Monitoring) allows you to monitor software services and applications in real time, collecting detailed performance information on response time for incoming requests, database queries, calls to caches, external HTTP requests, etc.`,
      },
      instanceConfigurationDescription: {
        id: `sliders.apm.instanceConfigurationDescription`,
        defaultMessage: `Monitors software services and applications in real time, collecting detailed performance information.`,
      },
    }),
    iconType: `logoObservability`,
    trialLimit: {
      memorySize: 1024,
      zoneCount: 1,
    },
    userSettingsFileName: `apm-server.yml`,
  },
  {
    testFn: ({ version }: DynamicSliderInstanceDefinitionParams) =>
      isFleetServerAvailable({ version }),
    messages: defineMessages({
      prettyName: {
        id: `sliders.apmFleet.prettyName`,
        defaultMessage: `APM & Fleet`,
      },
      description: {
        id: `sliders.apmFleet.description`,
        defaultMessage: `<p><apmLink>Application Performance Monitoring (APM)</apmLink> collects in-depth performance metrics and errors from your applications. <fleetLink>Fleet</fleetLink> allows you to centrally manage Elastic Agents installed on servers, laptops, and other hosts.</p><p>Next, launch APM to configure APM and add APM agents, or launch Fleet to add Elastic Agents.</p>`,
        values: {
          p: (content) => <p>{content}</p>,
          apmLink: (content) => <DocLink link='apmServerOverview'>{content}</DocLink>,
          fleetLink: (content) => <DocLink link='fleetOverview'>{content}</DocLink>,
        },
      },
      instanceConfigurationDescription: {
        id: `sliders.apmFleet.instanceConfigurationDescription`,
        defaultMessage: `Enable <apmLink>APM</apmLink> and centrally manage <fleetLink>Elastic Agents with Fleet Server</fleetLink>.`,
        values: {
          apmLink: (content) => <DocLink link='apmServerOverview'>{content}</DocLink>,
          fleetLink: (content) => <DocLink link='fleetOverview'>{content}</DocLink>,
        },
      },
    }),
  },
]

export default definition
