import type { TaskQueue } from 'owa-task-queue';
import { createQueue } from './util/factory';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logStartUsage } from 'owa-analytics-start';
import { getQueryStringParameter } from 'owa-querystring';
import sleep from 'owa-sleep';
import type { Task, GovernedTask } from './governedTask';
import { lazyTti } from './index';

// concurrency: number of simultaneous tasks that can run in a js quanta
// delay: the delay before the governor starts processing jobs
// pulse: the delay between js quanta for jobs
interface GovernorProfile {
    concurrency: number;
    delay: number;
    pulse: number;
}

const defaultProfile: GovernorProfile = { concurrency: 3, delay: 1, pulse: 1 };
const CONCURRENCY_QUERYSTRING_KEY = 'ttiConcurrency';
const DELAY_QUERYSTRING_KEY = 'ttiDelay';
const PULSE_QUERYSTRING_KEY = 'ttiPulse';
const MONKEY_QUERYSTRING_KEY = 'ttiMonkey';

// how long to delay a randomly selected job
const TTI_TIMEOUT = 45000;
const MONKEY_DELAY_MS = 60000;
const UNINITIALIZED = -1;

let lazyQueue: Promise<TaskQueue<Task>> | null = null;
let lazyIdleQueue: Promise<TaskQueue<Task>> | null = null;
let profileUsed: GovernorProfile | null = null;
let numGoverned: number = 0;
let sendReport: boolean = false;
let currentTaskNum: number = UNINITIALIZED;
let monkeyTaskNum: number = UNINITIALIZED;

export function test_resetState() {
    lazyQueue = null;
    lazyIdleQueue = null;
    profileUsed = null;
    numGoverned = 0;
    sendReport = false;
    currentTaskNum = UNINITIALIZED;
    monkeyTaskNum = UNINITIALIZED;
}

export async function govern(...args: GovernedTask[]) {
    for (let ii = 0; ii < args.length; ++ii) {
        const arg = args[ii];

        const taskToRun: Task = typeof arg === 'function' ? arg : arg.task;
        const runIt: boolean =
            typeof arg === 'function' || !('condition' in arg) || !!arg.condition;
        const waitForIdle: boolean = typeof arg !== 'function' && !!arg.idle;

        if (runIt) {
            numGoverned++;
            let q = await getQueue(waitForIdle);
            q.add(taskToRun);
        }
    }
}

export function enableGovernReport() {
    sendReport = true;

    if (isFeatureEnabled('fwk-tti-governor-monkey')) {
        monkeyTaskNum = getParam(MONKEY_QUERYSTRING_KEY, Math.floor(Math.random() * numGoverned));
    }
}

function getQueue(waitForIdle: boolean): Promise<TaskQueue<Task>> {
    if (waitForIdle) {
        if (!lazyIdleQueue) {
            lazyIdleQueue = createTaskPromise(
                Promise.race([lazyTti.importAndExecute(), sleep(TTI_TIMEOUT)])
            );
        }
        return lazyIdleQueue;
    }

    if (!lazyQueue) {
        lazyQueue = createTaskPromise();
    }
    return lazyQueue;
}

function createTaskPromise(timingPromise?: Promise<unknown>): Promise<TaskQueue<Task>> {
    const profile = getProfile();
    return (timingPromise || sleep(profile.delay)).then(() =>
        createQueue(profile.concurrency, runTask, profile.pulse)
    );
}

function getProfile(): GovernorProfile {
    if (!profileUsed) {
        profileUsed = {
            concurrency: getParam(CONCURRENCY_QUERYSTRING_KEY, defaultProfile.concurrency),
            pulse: getParam(PULSE_QUERYSTRING_KEY, defaultProfile.pulse),
            delay: getParam(DELAY_QUERYSTRING_KEY, defaultProfile.delay),
        };
    }
    return profileUsed;
}

function getParam(p: string, fallback: number): number {
    let rv = fallback;

    if (isFeatureEnabled('fwk-devTools')) {
        rv = parseInt(getQueryStringParameter(p)) || fallback;
    }

    return rv;
}

function runTask(task: Task): Promise<any> {
    currentTaskNum++;

    if (currentTaskNum == monkeyTaskNum) {
        setTimeout(task, MONKEY_DELAY_MS);
    } else {
        task();
    }

    if (sendReport && currentTaskNum == numGoverned - 1) {
        logStartUsage('ttiGovernEnd', { ...profileUsed, monkey: monkeyTaskNum });
        sendReport = false;
    }

    return Promise.resolve();
}
