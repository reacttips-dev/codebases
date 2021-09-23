// This is a little implementation of the Actor pattern.
// https://en.wikipedia.org/wiki/Actor_model/
//
// The idea is that we have a fast event source (the mouse or something),
// and we have a slower obedient server (an RPC or something),
// and we want to obey the fast event source as best as possible,
// WITHOUT allowing a queue of commands to build up.
//
// given an async function, f,
// return a somewhat similar function, g, which:
// 1. when called when idle, starts f.
// 2. when called while f is running, and pending is empty, stores the args in pending.
// 3. when called while running and pending is full, REPLACE the args in pending,
//    stomping on whatever instructions were sent and stored in pending previously.
//
// The second argument is an error handler. Because g does NOT return a promise,
// we cannot throw exceptions into the calling context. Exceptions force the
// Actor to idle, and they are passed into the error handler, but they don't
// break the SerialActor permanently.

module.exports = function trackSerially(f, errorHandler) {
    async function run() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            while (answer.pending !== null) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                const temp = answer.pending;
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                answer.pending = null;
                // eslint-disable-next-line no-await-in-loop
                await f(...temp);
            }
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            answer.idle = true;
        }
    }

    const answer = Object.assign(
        (...args) => {
            if (answer.idle) {
                answer.pending = args;
                answer.idle = false;
                // We are here discarding the Promise returned by run.
                // This is a "fire-and-forget" sort of functionality.
                run().catch(errorHandler);
            } else {
                answer.pending = args;
            }
        }, {
            idle: true,
            pending: null,
        },
    );

    return answer;
};