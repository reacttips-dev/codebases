import { PlainFormatter } from './MetricFormatter'
import { mainThreadActivityColors } from '../theme'

const SERIES_NAME = {
  scripting: 'Scripting'
}

const SORTED_TYPES = [
  'runTask',
  'parseHTML',
  'scripting',
  'scriptEvaluation',
  'scriptParseCompile',
  'styleLayout',
  'paintCompositeRender',
  'blocking'
]

const formatActivity = (activity, overrides = {}) => {
  let { name, type } = activity
  let series = name

  if (name === 'Other') {
    series = 'Task'
    type = 'runTask'
  } else if (
    ['scriptParseCompile', 'scriptEvaluation'].includes(activity.type)
  ) {
    type = 'scripting'
  }

  name = `${series} (${PlainFormatter({
    number: activity.duration,
    formatter: 'humanDuration'
  })})`

  return {
    ...activity,
    name,
    series,
    type,
    color:
      mainThreadActivityColors[activity.type] ||
      mainThreadActivityColors.undefined,
    profile: type,
    startTime: activity.start_time,
    endTime: activity.end_time,
    duration: activity.duration,
    y: 0,
    height: 100,
    ...overrides
  }
}

export const formatMainThreadData = activities => {
  const segments = []
  const series = [
    {
      name: 'Long task warning',
      color: mainThreadActivityColors['blocking'].active,
      type: 'blocking',
      uuid: 'blocking'
    }
  ]

  const updateSeries = activity => {
    if (!series.find(({ type }) => type === activity.type)) {
      const name = SERIES_NAME[activity.type] || activity.series

      series.push({
        name,
        uuid: activity.type,
        color: (
          mainThreadActivityColors[activity.type] ||
          mainThreadActivityColors.undefined
        ).active,
        type: activity.type
      })
    }
  }

  let id = 0
  for (const activity of activities) {
    const formattedActivity = formatActivity(activity, { id: `activity-${id}` })

    if (formattedActivity.tasks && formattedActivity.tasks.length) {
      const blockingStartTime = formattedActivity.start_time + 50
      const blockingDuration = formattedActivity.duration - 50

      segments.push(
        formatActivity(formattedActivity, {
          blockingDuration: blockingDuration,
          color: mainThreadActivityColors['runTask']
        })
      )

      segments.push(
        formatActivity(formattedActivity, {
          name: null,
          profile: 'blocking',
          startTime: blockingStartTime,
          duration: blockingDuration,
          color: mainThreadActivityColors['blocking'],
          y: -100,
          height: 10
        })
      )

      let taskId = 0
      for (const task of formattedActivity.tasks) {
        const taskActivity = formatActivity(task, {
          id: `activity-${id}-task-${taskId}`
        })

        if (SORTED_TYPES.indexOf(taskActivity.type) < 0) continue

        if (taskActivity.end_time < blockingStartTime) {
          taskActivity.blockingDuration = 0
        } else if (taskActivity.start_time < blockingStartTime) {
          taskActivity.blockingDuration =
            taskActivity.end_time - blockingStartTime
        } else {
          taskActivity.blockingDuration = taskActivity.duration
        }

        segments.push(taskActivity)

        taskId++

        updateSeries(taskActivity)
      }
    } else {
      if (SORTED_TYPES.indexOf(formattedActivity.type) < 0) continue

      segments.push(formattedActivity)

      segments.push(
        formatActivity(formattedActivity, {
          id: `blocking-${id}`,
          name: null,
          profile: activity.type,
          startTime: activity.start_time + 50,
          endTime: activity.end_time - 50,
          duration: activity.duration - 50,
          color: mainThreadActivityColors['blocking'],
          y: -100,
          height: 10
        })
      )

      updateSeries(formattedActivity)
    }

    id++
  }

  return {
    segments,
    series: series.sort(
      (a, b) => SORTED_TYPES.indexOf(a.type) - SORTED_TYPES.indexOf(b.type)
    )
  }
}
