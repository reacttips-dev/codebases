import React from 'react'

import { FieldGroup, Select, Input } from '../../../../Forms'
import hourInUTC from '../../../../../utils/hourInUTC'

const HourSelect = props => (
  <FieldGroup
    labelid="site.settings.agent.hour.label"
    helpid="site.settings.agent.hour.help"
  >
    <Input type="number" min="1" max="168" {...props} />
  </FieldGroup>
)

const TimeSelect = props => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <FieldGroup
      labelid="site.settings.agent.time.label"
      help={`The time is localised to ${tz} timezone.`}
    >
      <Select
        options={[
          { label: 'Midnight', value: hourInUTC(0) },
          { label: '1am', value: hourInUTC(1) },
          { label: '2am', value: hourInUTC(2) },
          { label: '3am', value: hourInUTC(3) },
          { label: '4am', value: hourInUTC(4) },
          { label: '5am', value: hourInUTC(5) },
          { label: '6am', value: hourInUTC(6) },
          { label: '7am', value: hourInUTC(7) },
          { label: '8am', value: hourInUTC(8) },
          { label: '9am', value: hourInUTC(9) },
          { label: '10am', value: hourInUTC(10) },
          { label: '11am', value: hourInUTC(11) },
          { label: '12pm', value: hourInUTC(12) },
          { label: '1pm', value: hourInUTC(13) },
          { label: '2pm', value: hourInUTC(14) },
          { label: '3pm', value: hourInUTC(15) },
          { label: '4pm', value: hourInUTC(16) },
          { label: '5pm', value: hourInUTC(17) },
          { label: '6pm', value: hourInUTC(18) },
          { label: '7pm', value: hourInUTC(19) },
          { label: '8pm', value: hourInUTC(20) },
          { label: '9pm', value: hourInUTC(21) },
          { label: '10pm', value: hourInUTC(22) },
          { label: '11pm', value: hourInUTC(23) }
        ]}
        {...props}
      />
    </FieldGroup>
  )
}

const Schedule = ({ scheduleInterval, scheduleAnchor, onChange, loading }) => (
  <>
    <FieldGroup
      data-testid="agent-settings-schedule"
      labelid="site.settings.agent.schedule.label"
      helpid="site.settings.agent.schedule.help"
    >
      <Select
        data-testid="agent-settings-schedule-interval"
        name="agent_settings_schedule_interval"
        options={[
          { label: 'Off', value: 'off' },
          { label: 'Daily', value: 'daily' },
          { label: 'Every X Hours', value: 'every_x_hours' },
          { label: 'Hourly', value: 'hourly' }
        ]}
        defaultValue={scheduleInterval}
        onChange={scheduleInterval => onChange({ scheduleInterval })}
        loading={loading}
      />
    </FieldGroup>

    {scheduleInterval == 'every_x_hours' && (
      <HourSelect
        data-testid="agent-settings-schedule-hour"
        name="agent_settings_schedule_anchor"
        defaultValue={scheduleAnchor}
        onChange={scheduleAnchor =>
          onChange({ scheduleAnchor: parseInt(scheduleAnchor, 10) })
        }
      />
    )}

    {scheduleInterval == 'daily' && (
      <TimeSelect
        data-testid="agent-settings-schedule-time"
        name="agent_settings_schedule_anchor"
        defaultValue={scheduleAnchor}
        onChange={scheduleAnchor =>
          onChange({ scheduleAnchor: parseInt(scheduleAnchor, 10) })
        }
      />
    )}
  </>
)

export default Schedule
