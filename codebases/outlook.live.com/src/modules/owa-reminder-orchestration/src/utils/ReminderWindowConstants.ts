export const MIN_MINUTES_PAST = -15;
// We make two GetReminders call during boot. One gets the reminders for next couple of hours and the other
// gets the reminders for next 24 hours (used to schedule timers for getting web push reminders). Since there is an
// overlap of ~2 hours in both the service calls, this was resulting in a race condition (DuplicateSecondaryKeyException
// and ConflictException) when trying to write to the store. So changed the 24 hour service call to query from now + 105 mins
// instead of the current time. So we need to keep the start time / end time for both the service calls in sync. Please
// make sure to change the START_TIME in the orchestrator getRemindersForWebPush if the MAX_MINUTES_FUTURE is changed.
// Ideally Start_Time should always be (MAX_MINUTES_FUTURE - 15). Keeping an overlap of 15 mins with the 24 hour call
// so that none of the reminders slip through the crack.
export const MAX_MINUTES_FUTURE = 120;

export const REMINDER_WINDOW_OVERLAP_MS = 5 * 60 * 1000;
export const MAX_MS_BEFORE_REFRESH = MAX_MINUTES_FUTURE * 60 * 1000 - REMINDER_WINDOW_OVERLAP_MS;
export const MIN_MS_BEFORE_REFRESH = REMINDER_WINDOW_OVERLAP_MS;

// Maximum time we can schedule a timer in the future.
// NOTE: We use 24 days here so that we don't go over setTimeout 32-bit signed integer limit.
// If that happens, client will get into an infinite timer loop and consume a bunch of CPU.
export const MAX_MS_FOR_TIMER = 24 * 24 * 60 * 60 * 1000;
