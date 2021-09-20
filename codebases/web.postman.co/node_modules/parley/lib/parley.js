/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var Deferred = require('./private/Deferred');

// Optimization: Pull process env check up here.
var IS_DEBUG_OR_NON_PRODUCTION_ENV = (
  process.env.NODE_ENV !== 'production' ||
  process.env.DEBUG
);

/**
 * parley()
 *
 * Build a deferred object that supports Node-style callbacks and promises.
 * > See README.md for more details.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param {Function} handleExec
 *        The `handleExec` function to call (either immediately or when the Deferred
 *        is executed, depending on whether an explicit cb was provided)
 *
 * @param {Function?} explicitCbMaybe
 *        An optional parameter that, if specified, is passed directly as the incoming
 *        `done` argument to your "handleExec" handler function (i.e. _its_ callback).
 *        Otherwise, if it is omitted, then handleExec receives an internally-generated
 *        callback (from parley) as its `done` argument.  When called, this implicit `done`
 *        will appropriately dispatch with the deferred object.  Finally, note that if an
 *        explicit callback is provided, parley will return undefined instead of returning
 *        a Deferred.
 *        > The nice thing about this is that it allows implementor code that provides this
 *        > feature to avoid manually duplicating the branching logic (i.e. the code that
 *        > checks to see if an explicit cb was provided, and if not, returns a new Deferred)
 *
 * @param {Dictionary?} customMethods
 *        An optional dictionary of custom functions that, if specified, will be used to extend
 *        the Deferred object.  It omitted, then only the default methods like `.exec()` will
 *        exist.
 *        > e.g.
 *        > ```
 *        > {
 *        >   where: function (whereClause) {
 *        >     this._criteria = this._criteria || {};
 *        >     this._criteria.where = whereClause;
 *        >     return this;
 *        >   },
 *        >   foo: function(){...},
 *        >   bar: function(){...},
 *        >   ...
 *        > }
 *
 * @param {Number?} timeout
 *        Optional.  If specified, timeouts will be enabled, and this number will indicate
 *        the max # of milliseconds to let the `handleExec` logic run before giving up and
 *        failing with a TimeoutError.  (To disable timeouts, leave this undefined.)
 *
 * @param {Error?} omen
 *        An optional omen to use for improving the stack trace, in the event of an error.
 *
 * @param {Function?} finalAfterExecLC
 *        An optional, synchronous handler function for intercepting the arguments to .exec()'s
 *        callback.  Only applicable when using the Deferred-style usage-- including when using
 *        promises via ES8's async/await or .then()/.catch().  Receives the `(err, result)`
 *        function signature, where either `err` is an Error instance and `result` is undefined,
 *        or `err` is undefined and `result` may or may not exist.  In any case, if specified,
 *        this handler function MUST not throw, and it MUST respect standard node-style callback
 *        conventions insofar as how it decides a return value.  For example, if it receives `err`,
 *        it must return an Error instance.  (ENFORCING THIS IS UP TO YOUR CODE!)
 *        > NOTE: The purpose of this handler is to allow for changing the behavior of .exec()
 *        > without necessarily calling it, or reinventing the wheel and creating our own version.
 *        > For example, we might want to include nicer, more customized error messages.  Or we
 *        > might want to intercept built-in error scenarios that would be otherwise difficult to
 *        > capture-- things like timeouts, double-invocation, and unhandled throwing.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @returns {Deferred}
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @throws {Error} If there are unexpected usage problems with how parley() itself is called
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */

module.exports = function parley(handleExec, explicitCbMaybe, customMethods, timeout, omen, finalAfterExecLC){

  // A few (very carefully picked) sanity checks for implementors.
  //
  // > Note that we deliberately use `typeof` instead of _.isFunction() for performance.
  if (!handleExec) {
    throw new Error('Consistency violation: Must specify a first argument when calling parley() -- please provide a `handleExec` function or a dictionary of options');
  }
  if (typeof handleExec !== 'function') {
    throw new Error('Consistency violation: First argument to parley() should be a function.  But instead, got: '+util.inspect(handleExec, {depth:2})+'');
  }


  //==========================================================================================
  // ALL OTHER **IMPLEMENTOR** USAGE CHECKS WERE REMOVED FOR PERFORMANCE REASONS.
  //
  // > Check out this commit for more of the original code:
  // > https://github.com/mikermcneil/parley/commit/e7ec7e445e2a502b9fcb57bc746c7b9714d3cf16
  // >
  // > Or for another example of a simple check that would pack a 24% performance hit
  // > for building Deferreds, see:
  // > https://github.com/mikermcneil/parley/commit/7d475d0c2165b683d8d5af98a4d073875f14cbd3
  // >
  // > Also note we still do a few (very carefully picked) validations for things that could
  // > affect end users of parley-implementing functions -- i.e. code that calls .exec() twice,
  // > etc.  That's all handled elsewhere (where the exec() method is defined.)
  //==========================================================================================


  //  ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗
  //  ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝
  //  ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗
  //  ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝
  //  ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
  //  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝
  //
  //  ███████╗██╗  ██╗██████╗ ██╗     ██╗ ██████╗██╗████████╗     ██████╗██████╗
  //  ██╔════╝╚██╗██╔╝██╔══██╗██║     ██║██╔════╝██║╚══██╔══╝    ██╔════╝██╔══██╗
  //  █████╗   ╚███╔╝ ██████╔╝██║     ██║██║     ██║   ██║       ██║     ██████╔╝
  //  ██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║██║     ██║   ██║       ██║     ██╔══██╗
  //  ███████╗██╔╝ ██╗██║     ███████╗██║╚██████╗██║   ██║       ╚██████╗██████╔╝
  //  ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝ ╚═════╝╚═╝   ╚═╝        ╚═════╝╚═════╝
  //
  //  ╦╔═╗  ┌─┐┬─┐┌─┐┬  ┬┬┌┬┐┌─┐┌┬┐
  //  ║╠╣   ├─┘├┬┘│ │└┐┌┘│ ││├┤  ││
  //  ╩╚    ┴  ┴└─└─┘ └┘ ┴─┴┘└─┘─┴┘
  // If explicitCb provided, run the handleExec logic, then call the explicit callback.
  //
  // > All of the additional checks from below (e.g. try/catch) are NOT performed
  // > in the situation where an explicit callback was provided.  This is to allow
  // > for userland code to squeeze better performance out of particular method calls
  // > by simply passing through the callback directly.
  // > (As a bonus, it also avoids duplicating the code below in this file.)
  if (explicitCbMaybe) {

    handleExec(explicitCbMaybe);

    //  ██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
    //  ██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
    //  ██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
    //  ██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
    //  ██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
    //  ╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
    //
    //  ██╗   ██╗███╗   ██╗██████╗ ███████╗███████╗██╗███╗   ██╗███████╗██████╗
    //  ██║   ██║████╗  ██║██╔══██╗██╔════╝██╔════╝██║████╗  ██║██╔════╝██╔══██╗
    //  ██║   ██║██╔██╗ ██║██║  ██║█████╗  █████╗  ██║██╔██╗ ██║█████╗  ██║  ██║
    //  ██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██╔══╝  ██║  ██║
    //  ╚██████╔╝██║ ╚████║██████╔╝███████╗██║     ██║██║ ╚████║███████╗██████╔╝
    //   ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚═════╝
    //
    return;

  }//-•

  // Otherwise, no explicit callback was provided- so we'll build & return a Deferred...


  //   ██████╗ ████████╗██╗  ██╗███████╗██████╗ ██╗    ██╗██╗███████╗███████╗
  //  ██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗██║    ██║██║██╔════╝██╔════╝██╗
  //  ██║   ██║   ██║   ███████║█████╗  ██████╔╝██║ █╗ ██║██║███████╗█████╗  ╚═╝
  //  ██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗██║███╗██║██║╚════██║██╔══╝  ██╗
  //  ╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║╚███╔███╔╝██║███████║███████╗╚═╝
  //   ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝
  //
  //  ██████╗ ██╗   ██╗██╗██╗     ██████╗
  //  ██╔══██╗██║   ██║██║██║     ██╔══██╗
  //  ██████╔╝██║   ██║██║██║     ██║  ██║
  //  ██╔══██╗██║   ██║██║██║     ██║  ██║
  //  ██████╔╝╚██████╔╝██║███████╗██████╔╝
  //  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝
  //
  //  ██████╗ ███████╗███████╗███████╗██████╗ ██████╗ ███████╗██████╗
  //  ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
  //  ██║  ██║█████╗  █████╗  █████╗  ██████╔╝██████╔╝█████╗  ██║  ██║
  //  ██║  ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗██╔══██╗██╔══╝  ██║  ██║
  //  ██████╔╝███████╗██║     ███████╗██║  ██║██║  ██║███████╗██████╔╝
  //  ╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝
  //
  // Build deferred object.
  //
  // > For more info & benchmarks, see:
  // > https://github.com/mikermcneil/parley/commit/5996651c4b15c7850b5eb2e4dc038e8202414553#commitcomment-20256030
  // >
  // > And also `baseline.benchmark.js` in this repo.
  // >
  // > But then also see:
  // > https://github.com/mikermcneil/parley/commit/023dc9396bdfcd02290624ca23cb2d005037f398
  // >
  // > (Basically, it keeps going back and forth between this and closures, but after a lot
  // > of experimentation, the prototypal approach seems better for overall performance.)
  var π = new Deferred(handleExec);


  // If appropriate, start the 15 second .exec() countdown.
  var EXEC_COUNTDOWN_IN_SECONDS = 15;
  if (IS_DEBUG_OR_NON_PRODUCTION_ENV) {
    π._execCountdown = setTimeout(function(){
      // IWMIH, it means that this Deferred hasn't begun executing,
      // even after 15 seconds.  This deserves a warning log.
      // > See https://trello.com/c/7QnQZ6aC for more background.
      console.warn(
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n'+
        'WARNING: A function that was initially called over '+EXEC_COUNTDOWN_IN_SECONDS+' seconds\n'+
        'ago has still not actually been executed.  Any chance the\n'+
        'source code is missing an "await"?\n'+
        '\n'+
        (π._omen?(
          'To assist you in hunting this down, here is a stack trace:\n'+
          '```\n'+
          flaverr.getBareTrace(π._omen)+'\n'+
          '```\n'+
          '\n'
        ):'')+
        // 'Please double-check this code is not missing an "await".\n'+
        // '\n'+
        ' [?] For more help, visit https://sailsjs.com/support\n'+
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
      );
    }, EXEC_COUNTDOWN_IN_SECONDS*1000);
  }//ﬁ


  //  ┌─┐┌┬┐┌┬┐┌─┐┌─┐┬ ┬  ╔═╗╦ ╦╔═╗╔╦╗╔═╗╔╦╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  //  ├─┤ │  │ ├─┤│  ├─┤  ║  ║ ║╚═╗ ║ ║ ║║║║  ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  //  ┴ ┴ ┴  ┴ ┴ ┴└─┘┴ ┴  ╚═╝╚═╝╚═╝ ╩ ╚═╝╩ ╩  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  //  ┌─    ┬┌─┐  ┬─┐┌─┐┬  ┌─┐┬  ┬┌─┐┌┐┌┌┬┐    ─┐
  //  │───  │├┤   ├┬┘├┤ │  ├┤ └┐┌┘├─┤│││ │   ───│
  //  └─    ┴└    ┴└─└─┘┴─┘└─┘ └┘ ┴ ┴┘└┘ ┴     ─┘
  // If a dictionary of `customMethods` were provided, attach them dynamically.
  if (customMethods) {

    // Even with no contents, using an _.each() loop here would actually hurt the performance
    // of the "just_build" benchmark by 93% (~13x as slow).  Granted, it was very fast to
    // begin with... but compare with this `for` loop which, with no contents, only hurts
    // the same benchmark's performance by 25% ~(1.3x as slow).
    var methodFn;
    for (var methodName in customMethods) {

      // We explicitly prevent overriding:
      if (
        // • built-in methods:
        methodName === 'exec' ||
        methodName === 'then' ||
        methodName === 'catch' ||
        methodName === 'toPromise' ||
        methodName === 'intercept' ||
        methodName === 'tolerate' ||
        // (Note that we explicitly omit `.log()`, `.now()`, and `.timeout()`
        // so that they may be potentially overridden.)

        // • other special, private properties:
        methodName === '_execCountdown' ||
        methodName === '_hasBegunExecuting' ||
        methodName === '_hasFinishedExecuting' ||
        methodName === '_hasStartedButNotFinishedAfterExecLC' ||
        methodName === '_hasAlreadyWaitedAtLeastOneTick' ||
        methodName === '_skipImplSpinlockWarning' ||
        methodName === '_hasTimedOut' ||
        methodName === '_handleExec' ||
        methodName === '_promise' ||
        methodName === '_timeout' ||
        methodName === '_omen' ||
        methodName === '_userlandAfterExecLCs' ||
        methodName === '_finalAfterExecLC' ||

        // • the standard JavaScript object flora:
        methodName === '__defineGetter__' ||
        methodName === '__defineSetter__' ||
        methodName === '__lookupGetter__' ||
        methodName === '__lookupSetter__' ||
        methodName === '__proto__' ||
        methodName === 'constructor' ||
        methodName === 'hasOwnProperty' ||
        methodName === 'isPrototypeOf' ||
        methodName === 'propertyIsEnumerable' ||
        methodName === 'toLocaleString' ||
        methodName === 'toString' ||
        methodName === 'valueOf' ||

        // • and things that are just a really bad idea:
        //   (or at the very least, which shouldn't be defined this way)
        methodName === 'prototype' ||
        methodName === 'toJSON' ||
        methodName === 'inspect'
      ) {
        throw new Error('Cannot define custom method (`.'+methodName+'()`) because `'+methodName+'` is a reserved/built-in property.');
      }
      methodFn = customMethods[methodName];
      π[methodName] = methodFn;
    }//</for>

  }//>-


  //  ┌─┐┌┬┐┌┬┐┌─┐┌─┐┬ ┬  ╔╦╗╦╔╦╗╔═╗╔═╗╦ ╦╔╦╗
  //  ├─┤ │  │ ├─┤│  ├─┤   ║ ║║║║║╣ ║ ║║ ║ ║
  //  ┴ ┴ ┴  ┴ ┴ ┴└─┘┴ ┴   ╩ ╩╩ ╩╚═╝╚═╝╚═╝ ╩
  //  ┌─    ┬┌─┐  ┬─┐┌─┐┬  ┌─┐┬  ┬┌─┐┌┐┌┌┬┐    ─┐
  //  │───  │├┤   ├┬┘├┤ │  ├┤ └┐┌┘├─┤│││ │   ───│
  //  └─    ┴└    ┴└─└─┘┴─┘└─┘ └┘ ┴ ┴┘└┘ ┴     ─┘
  if (timeout) {
    if (!_.isNumber(timeout)) { throw new Error('Consistency violation: If provided, `timeout` argument to parley should be a number (i.e. max # of milliseconds to wait before giving up).  But instead, got: '+util.inspect(timeout, {depth:2})+''); }
    π._timeout = timeout;
  }

  //  ┌─┐┌┬┐┌┬┐┌─┐┌─┐┬ ┬  ╔═╗╔╦╗╔═╗╔╗╔
  //  ├─┤ │  │ ├─┤│  ├─┤  ║ ║║║║║╣ ║║║
  //  ┴ ┴ ┴  ┴ ┴ ┴└─┘┴ ┴  ╚═╝╩ ╩╚═╝╝╚╝
  //  ┌─    ┬┌─┐  ┬─┐┌─┐┬  ┌─┐┬  ┬┌─┐┌┐┌┌┬┐    ─┐
  //  │───  │├┤   ├┬┘├┤ │  ├┤ └┐┌┘├─┤│││ │   ───│
  //  └─    ┴└    ┴└─└─┘┴─┘└─┘ └┘ ┴ ┴┘└┘ ┴     ─┘
  if (omen) {
    if (!_.isError(omen)) { throw new Error('Consistency violation: If provided, `omen` argument to parley should be a pre-existing omen (i.e. an Error instance).  But instead, got: '+util.inspect(omen, {depth:2})+''); }
    π._omen = omen;
  }

  //  ┌─┐┌┬┐┌┬┐┌─┐┌─┐┬ ┬  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔═╗╔╦╗╔═╗╔═╗╔╦╗╔═╗╦═╗╔═╗═╗ ╦╔═╗╔═╗
  //  ├─┤ │  │ ├─┤│  ├─┤  ║║║║ ║ ║╣ ╠╦╝║  ║╣ ╠═╝ ║ ╠═╣╠╣  ║ ║╣ ╠╦╝║╣ ╔╩╦╝║╣ ║
  //  ┴ ┴ ┴  ┴ ┴ ┴└─┘┴ ┴  ╩╝╚╝ ╩ ╚═╝╩╚═╚═╝╚═╝╩   ╩ ╩ ╩╚   ╩ ╚═╝╩╚═╚═╝╩ ╚═╚═╝╚═╝
  //  ┌─    ┬┌─┐  ┬─┐┌─┐┬  ┌─┐┬  ┬┌─┐┌┐┌┌┬┐    ─┐
  //  │───  │├┤   ├┬┘├┤ │  ├┤ └┐┌┘├─┤│││ │   ───│
  //  └─    ┴└    ┴└─└─┘┴─┘└─┘ └┘ ┴ ┴┘└┘ ┴     ─┘
  if (finalAfterExecLC) {
    if (!_.isFunction(finalAfterExecLC)) { throw new Error('Consistency violation: If provided, `finalAfterExecLC` argument to parley should be a handler function (see parley README for more information or visit https://sailsjs.com/support for help).  But instead of that function, got: '+util.inspect(finalAfterExecLC, {depth:5})+''); }
    π._finalAfterExecLC = finalAfterExecLC;
  }

  //  ██████╗ ███████╗████████╗██╗   ██╗██████╗ ███╗   ██╗
  //  ██╔══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗████╗  ██║
  //  ██████╔╝█████╗     ██║   ██║   ██║██████╔╝██╔██╗ ██║
  //  ██╔══██╗██╔══╝     ██║   ██║   ██║██╔══██╗██║╚██╗██║
  //  ██║  ██║███████╗   ██║   ╚██████╔╝██║  ██║██║ ╚████║
  //  ╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
  //
  //  ██████╗ ███████╗███████╗███████╗██████╗ ██████╗ ███████╗██████╗
  //  ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
  //  ██║  ██║█████╗  █████╗  █████╗  ██████╔╝██████╔╝█████╗  ██║  ██║
  //  ██║  ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗██╔══██╗██╔══╝  ██║  ██║
  //  ██████╔╝███████╗██║     ███████╗██║  ██║██║  ██║███████╗██████╔╝
  //  ╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝
  //
  // Return deferred object
  return π;

};//ƒ



// /**
//  * parley.callable()
//  *
//  * Build a simple function which returns a Deferred object.
//  * > This is a shortcut for building simple functions when you don't need the
//  * > full customizability of calling parley() to build a Deferred for you on the
//  * > fly (e.g. b/c you don't care about support chain-ability)
//  *
//  * CURRENTLY EXPERIMENTAL!
//  * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  * @param {AsyncFunction} gracefullyHandleExec
//  * @param {Number?} timeout
//  * @param {Error?} omen
//  *
//  * @returns {Function}
//  */
// module.exports.callable = function(gracefullyHandleExec, timeout, omen){

//   console.warn('WARNING: parley.callable() is currently experimental and should not be relied upon.');

//   if (!_.isFunction(gracefullyHandleExec) || gracefullyHandleExec.constructor.name !== 'AsyncFunction') {
//     throw new Error('parley.callable() expects an async function (e.g. `async ()=>{}`) to be provided as the first argument.  Instead, got: '+require('util').inspect(gracefullyHandleExec));
//   }//•

//   return function handleCalling(/*…*/) {
//     var parley = module.exports;
//     var returnedFnArguments = arguments;
//     var returnedFnCtx = this;//« should really never matter, we just do it this way for consistency
//     omen = omen || flaverr.omen(handleCalling);
//     return parley(function(done) {
//       gracefullyHandleExec.apply(returnedFnCtx, returnedFnArguments)
//       .then(function(result) {
//         done(undefined, result);
//       })
//       .catch(function(err) {
//         done(err);
//       });
//     }, undefined, undefined, timeout, omen, undefined);
//   };//ƒ

// };//ƒ
