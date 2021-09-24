import React, { useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import Breadcrumbs from '../../Breadcrumbs'
import { Lockup, Section, Row, Col } from '../../Layout'
import { Flex, Box } from '../../Grid'
import Button, { GuideButton } from '../../Button'
import { Strong, TextLink } from '../../Type'
import Feedback from '../Feedback'

import MetricCategory from './MetricCategory'

const ChooseMetric = ({
  metricCategories: initialMetricCategories,
  currentMetric,
  onBack,
  onSave,
  saving,
  feedback
}) => {
  const formRef = useRef()
  const [newMetric, setNewMetric] = useState(currentMetric)

  const handleSubmit = event => {
    event.preventDefault()
    onSave(newMetric)
  }

  const metricCategories = initialMetricCategories
    .map(({ metrics, ...props }) => ({
      ...props,
      recommendedMetrics: metrics.filter(
        ({ recommended, name }) => recommended || name === currentMetric
      ),
      otherMetrics: metrics.filter(({ recommended }) => !recommended)
    }))
    .filter(({ recommendedMetrics }) => recommendedMetrics.length)

  return (
    <form onSubmit={handleSubmit} ref={formRef} data-qa="pageForm">
      <Section>
        <Flex alignItems="center">
          <Box flex={1} mb={0}>
            <Breadcrumbs>
              <TextLink onClick={onBack}>
                <FormattedMessage id="pages.title" />
              </TextLink>
              <FormattedMessage id="pages.metrics.customise.title" />
            </Breadcrumbs>
          </Box>
          <Box pr={1} width={[1, 'auto']}>
            <GuideButton href="/docs/features/pages-leaderboard#customise-displayed-metrics">
              <FormattedMessage id="pages.actions.metrics.guide" />
            </GuideButton>
          </Box>
        </Flex>
      </Section>
      <Section borderBottom="none" p={undefined} px={4} pt={4} pb={0}>
        <Lockup
          id="pages.metrics.customise.lockup"
          mb={0}
          values={{
            metric: (
              <Strong>{currentMetric.shortLabel || currentMetric.label}</Strong>
            )
          }}
        />
      </Section>
      {metricCategories.map((metricCategory, index) => (
        <Section
          key={index}
          mt={index === 0 ? -4 : 0}
          borderBottom={
            index === metricCategories.length - 1 ? '0px solid' : '1px solid'
          }
        >
          <MetricCategory
            {...metricCategory}
            selectedMetric={newMetric}
            onSelectMetric={metric => setNewMetric(metric)}
          />
        </Section>
      ))}
      <Section mt={-4}>
        {!feedback || !!(feedback.type === 'success') || (
          <Row>
            <Col span={2}>
              <Feedback p={0} pb={4} duration={0} {...feedback} />
            </Col>
          </Row>
        )}

        <Flex>
          <Box mr="15px">
            <Button onClick={onBack} variant="tertiary">
              <FormattedMessage id="pages.actions.metrics.cancel" />
            </Button>
          </Box>
          <Box>
            <Button
              loading={saving}
              disabled={saving || newMetric.name === currentMetric.name}
              type="submit"
            >
              <FormattedMessage id="pages.actions.metrics.save" />
            </Button>
          </Box>
        </Flex>
      </Section>
    </form>
  )
}

export default ChooseMetric
