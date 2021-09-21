// we're using ffmpeg.js to do the audio ripping on the client and it uses web
// workers. node's equivalent to web workers are called worker threads, but it's
// not officially supported with our current version of node (v10).

// two things to workaround this:
// 1. ignore the `extractAudio` code when building the server bundle
//    -- otherwise webpack wouldn't be able to build the bundle. I put the
//    `extractAudio` code in a general `WebWorker` directory in case we end up
//    using web workers more and webpack is set up to ignore that directory entirely
// 2. whereever `extractAudio` is used, ignore the import if we're server
//    rendering the page

import { extractAudio } from './extractAudio';

export { extractAudio };
