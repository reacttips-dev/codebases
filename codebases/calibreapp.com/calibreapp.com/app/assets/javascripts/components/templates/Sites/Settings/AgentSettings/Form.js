import React, { useEffect, useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import { FieldSet, FieldGroup } from '../../../../Forms'
import Button from '../../../../Button'

import Location from './Location'
import Schedule from './Schedule'
import EstimatedUsage from './EstimatedUsage'

const AgentSettings = ({
  orgId,
  loading,
  saving,
  locations,
  onUpdate,
  location: initialLocation,
  scheduleInterval: initialScheduleInterval,
  scheduleAnchor: initialScheduleAnchor,
  pages,
  testProfiles
}) => {
  const formRef = useRef()
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState({
    location: initialLocation,
    scheduleInterval: initialScheduleInterval,
    scheduleAnchor: initialScheduleAnchor
  })

  useEffect(() => {
    setAttributes({
      location: initialLocation,
      scheduleInterval: initialScheduleInterval,
      scheduleAnchor: initialScheduleAnchor
    })
  }, [loading])

  useEffect(() => {
    setModified(saving)
  }, [saving])

  const handleSubmit = event => {
    event.preventDefault()
    onUpdate(attributes)
  }

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
    setModified(true)
  }

  const { location, scheduleInterval, scheduleAnchor } = attributes

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <FieldSet mb={0}>
        <Location
          loading={loading || !location}
          span={2}
          location={location}
          locations={locations}
          onChange={setAttribute}
        />
      </FieldSet>
      <FieldSet mb={0}>
        <Schedule
          loading={loading || !scheduleInterval}
          scheduleInterval={scheduleInterval}
          scheduleAnchor={scheduleAnchor}
          onChange={setAttribute}
        />
      </FieldSet>
      {scheduleInterval === 'off' ? null : (
        <FieldSet mb={0}>
          <FieldGroup span={2}>
            <EstimatedUsage
              numberOfPages={(pages || []).length}
              numberOfProfiles={(testProfiles || []).length}
              scheduleInterval={scheduleInterval}
              scheduleAnchor={scheduleAnchor}
              usageUrl={`/organisations/${orgId}/billing`}
            />
          </FieldGroup>
        </FieldSet>
      )}
      <Button
        data-testid="agent-settings-submit"
        disabled={!modified || saving}
        loading={saving}
        type="submit"
      >
        <FormattedMessage id="site.actions.update_agent" />
      </Button>
    </form>
  )
}

export default AgentSettings
