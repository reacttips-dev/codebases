import ApiService from './api-service';

export async function getSchedules(userId, ndKeys) {
    const promises = _.chain(ndKeys)
        .keyBy()
        .mapValues((ndKey) => {
            return getSchedule(userId, ndKey)
                .then((res) => _.get(res, 'data'))
                .catch((err) => {
                    if (err.status === 404) {
                        return null; // They never created a schedule, so just return null
                    }
                    throw err;
                });
        })
        .value();

    const schedules = await Promise.props(promises);
    return _.omitBy(schedules, _.isNull);
}

export function getSchedule(userKey, ndKey) {
    return ApiService.get(
        `${CONFIG.scheduleReminderUrl}/v1/schedules/${userKey}/nodes/${ndKey}`
    );
}

function createScheduleWithReminders(
    userKey,
    ndKey,
    timezone,
    wantsEmails,
    wantsSMS,
    reminders
) {
    return ApiService.post(
        `${CONFIG.scheduleReminderUrl}/v1/schedules/${userKey}/nodes/${ndKey}`, {
            email: Boolean(wantsEmails),
            sms: Boolean(wantsSMS),
            reminders,
            timezone,
        }
    );
}

function updateReminders(userKey, ndKey, task_name, reminders) {
    return ApiService.put(
        `${CONFIG.scheduleReminderUrl}/v1/schedules/${userKey}/nodes/${ndKey}/reminders/batch`, {
            task_name,
            reminders
        }
    );
}

export function updateSchedule(
    userKey,
    ndKey,
    timezone,
    wantsEmails,
    wantsSMS
) {
    return ApiService.patch(
        `${CONFIG.scheduleReminderUrl}/v1/schedules/${userKey}/nodes/${ndKey}`, {
            timezone,
            email: Boolean(wantsEmails),
            sms: Boolean(wantsSMS)
        }
    );
}

export function createOrUpdateSchedule(
    userKey,
    ndKey,
    task_name,
    timezone,
    wantsEmails,
    wantsSMS,
    reminders
) {
    return getSchedule(userKey, ndKey)
        .then((schedule) => {
            return updateReminders(userKey, ndKey, task_name, reminders).then(() => {
                return updateSchedule(
                    userKey,
                    ndKey,
                    timezone,
                    _.isBoolean(wantsEmails) ?
                    wantsEmails :
                    _.get(schedule, 'data.email'),
                    _.isBoolean(wantsSMS) ? wantsSMS : _.get(schedule, 'data.sms')
                );
            });
        })
        .catch((error) => {
            if (error.status === 404) {
                return createScheduleWithReminders(
                    userKey,
                    ndKey,
                    timezone,
                    wantsEmails || true,
                    wantsSMS,
                    reminders
                );
            }
            throw error;
        });
}