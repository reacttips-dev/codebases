// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// This is temporary.

// It exists so that the shimmed version of base.html won't try to attach
// window.channels.

// The shimmed version of base.html is something that exists on the server so
// that it can ship old versions of the web client with a static base.html --
// that is, without filling in things like window.channels dynamically at
// request time.

// Eventually, the plan is to backfill all previous deployments with that
// simplified version of base.html as their index.html. But those releases
// previously expected window.channels to be available at document ready, and
// it won't be anymore.

// Instead, the shimmed version will request it from the server.

// But this is kinda wasteful, as 99.99999% of users will be running the latest
// version of the client -- this version -- that *doesn't* depend on
// window.channels at all.

// By adding this flag, the shimmed base.html can be a little bit smarter,
// and skip that particular shim for newer (but still not self-contained)
// deployments.
window.knowsHowToLoadChannels = true;
