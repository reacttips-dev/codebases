export function getScheduleExists(state, nodeKey) {
    const schedules = _.get(state, 'schedules');
    return !_.isEmpty(schedules[nodeKey]);
}