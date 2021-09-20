/**
 * Module dependencies
 */

var path = require('path');
var util = require('util');
var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
// ("fs-extra" is also required below, conditionally, so as to allow for in-browser usage.)

/**
 * informReFailedAlterStratagem()
 *
 * Write a log message to stderr about what went wrong with this auto-migration attempt,
 * then write a temporary log file with the backup records
 *
 * @param  {Error} err
 * @param  {String} operationName
 *     • 'drop'
 *     • 'define'
 *     • 'createEach'
 * @param  {String}   modelIdentity
 * @param  {Array}   backupRecords
 * @param  {Function}   done
 *         @param {Error?} err
 *                @property {String?} code  (E_FAILED_ALTER_STRATEGY)
 */
module.exports = function informReFailedAlterStratagem(err, operationName, modelIdentity, backupRecords, done) {

  // Determine the path for the log file where we'll save these backup records.
  // (note that currently, we resolve the path relative to CWD)
  var timeSeriesUniqueishSuffixPiece = Math.floor((Date.now()%10000000)/1000);
  var relPathToLogFile = '.tmp/automigration.'+modelIdentity+'.'+timeSeriesUniqueishSuffixPiece+'.log';
  var absPathToLogFile = path.resolve(relPathToLogFile);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // FUTURE: Expect app path (e.g. `sails.config.appPath`) as another required argument to
  // ensure that this always writes log output in the proper place; rather than relying on
  // the current working directory, which won't necessarily be right.  (This isn't a show-stopper
  // or anything, but it could be important for certain kinds of hooks that want to get down and
  // dirty with the models and stuff.)
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // Build an error message that we'll log to the console in just a moment.
  var message = '\n'+
  'When attempting to perform the `alter` auto-migration strategy '+
  'on model `' + modelIdentity + '`, Sails encountered ';

  // Negotiate error in order to use an appropriate error message.
  var isUniquenessViolation = (
    operationName === 'createEach' &&
    (err.name === 'AdapterError' && err.code === 'E_UNIQUE')
  );
  var isCoercionFailure = (
    operationName === 'createEach' &&
    (err.name === 'UsageError' && err.code === 'E_INVALID_NEW_RECORDS')
  );

  if (isCoercionFailure) {
    message += 'incompatible data.  '+
    'Some existing `' + modelIdentity + '` record(s) couldn\'t be adjusted automatically to match '+
    'your model definition.  Usually, this is a result of recent edits to your model files; or (less often) '+
    'due to incomplete inserts or modifications made directly to the database by hand.\n'+
    '\n'+
    'Details:\n'+
    '```\n'+
    'Failed to reinsert migrated data. '+(err.details||err.message)+'\n'+
    '```\n';
  }
  else if (isUniquenessViolation) {
    message += 'a conflict.  '+
    'Some existing `' + modelIdentity + '` record(s) violated a uniqueness constraint when attempting to '+
    'recreate them in the database (i.e. there were duplicates).  This is usually the result of recent edits '+
    'to your model files.  For example, someone might have changed a non-unique attribute to be `unique: true`, '+
    'modified a unique attribute\'s `columnName`, or changed the primary key attribute, etc.  Otherwise (more rarely), '+
    'this could be due to additional physical-layer indexes or constraints that were added directly to the '+
    'database by hand.\n'+
    '\n'+
    'Details:\n'+
    '```\n'+
    util.inspect(err)+'\n'+
    '```\n';
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // FUTURE: More error negotiation could be done here to further improve this message.
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Otherwise this was some kind of weird, unexpected error.  So we use the catch-all approach:
  else {

    // Convert this error into a string we can safely log (since we have no idea what it
    // is or what it might mean, we can't really make any assumptions.)
    //
    // > Note that, while `err` should always be an Error instance already,
    // > we double check just in case it's not.
    var formattedDisplayError;
    if (_.isError(err) && _.keys(err).length === 0) { formattedDisplayError = err.stack; }
    else if (_.isError(err)) { formattedDisplayError = util.inspect(err); }
    else if (_.isString(err)) { formattedDisplayError = err; }
    else { formattedDisplayError = util.inspect(err, { depth: 5 }); }

    message += 'an unexpected error when performing the `'+operationName+'` step.  '+
    'This could have happened for a number of different reasons: be it because your database went offline, '+
    'because of a db permission issue, because of some database-specific edge case, or (more rarely) it '+
    'could even be due to some kind of bug in this adapter.\n'+
    '\n'+
    'Error details:\n'+
    '```\n'+
    formattedDisplayError+'\n'+
    '```\n';
  }


  // And last but not least, it's time for the suffix.
  message +=
  '\n'+
  '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- \n'+
  'Any existing `'+ modelIdentity + '` records were deleted, but your data from OTHER models '+
  '(including any relationships tracked in foreign keys and join tables) might still be intact.  '+
  'If you care about recovering any of that data, be sure to back it up now before you continue.\n'+
  // '(In the future, if you want to keep development data in order to practice manual migrations, '+
  // 'then set `migrate: \'safe\'` in config/models.js.)\n'+
  '\n'+
  'The best way to proceed from here is to clear out all of your old development data '+
  'and start fresh; allowing Sails to generate new tables/collections(s) to reflect your '+
  'app\'s models.  (In other words, to DELETE ALL EXISTING DATA stored in models.)\n'+
  '\n'+
  'To do that, re-lift your app using the `drop` strategy:\n'+
  '```\n'+
  'sails lift --drop\n'+
  '```\n'+
  '\n'+
  'After doing that once, you should be able to go about your business as usual.\n'+
  '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- \n'+
  '\n'+
  'For more about auto-migrations, visit:\n'+
  'https://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate\n'+
  '\n';

  // Now that we've fed our error message to make it big and strong, we can log the
  // completed error message to stderr so that the user understands what's up.
  console.error(message);


  // Now we'll build some suppementary logs:
  var logFileContents = '';
  logFileContents += 'On '+(new Date())+', Sails attempted to auto-migrate\n';
  logFileContents += 'using the `alter` strategy, but was unable to transform all of your\n';
  logFileContents += 'existing development data automatically.  This temporary file was created \n';
  logFileContents += 'for your convenience, as a way of holding on to the unmigrated records that\n';
  logFileContents += 'were originally stored in the `' + modelIdentity + '` model.\n';
  logFileContents += '(Otherwise, this data would have been lost forever.)\n';
  logFileContents += '\n';
  logFileContents += '================================\n';
  logFileContents += 'Recovered data (`' + modelIdentity + '`):\n';
  logFileContents += '================================\n';
  logFileContents += '\n';
  logFileContents += util.inspect(backupRecords, { depth: 5 })+'\n';
  logFileContents += '\n';
  logFileContents += '\n';
  logFileContents += '--\n';
  logFileContents += 'For help with auto-migrations, visit:\n';
  logFileContents += 'http://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate\n';
  logFileContents += '\n';
  logFileContents += 'For questions, additional resources, or to talk to a human, visit:\n';
  logFileContents += 'http://sailsjs.com/support\n';
  logFileContents += '\n';

  // And we'll write them.  (Where?  It depends.)
  (function(proceed){

    // Write logs to console if this is running in-browser
    if (typeof window === 'undefined') {
      console.log(logFileContents);
      return proceed();
    }//•

    // Import "fs-extra"
    // (Note that we only do this here, in case this is running in-browser.)
    var fsx = require('fs-extra');

    // Write backup records to disk in a temporary log file.
    fsx.outputFile(absPathToLogFile, logFileContents, function (err) {
      if (err) {
        console.error('\n'+
          'WARNING: Temporary log file w/ recovered dev data could not actually be written to disk!\n'+
          'Attempted to write it @ `'+absPathToLogFile+'`...\n'+
          'But that failed, because an error was encountered:\n'+
          util.inspect(err)+'\n'+
          '\n'+
          '(This is usually because no .tmp folder exists, or something similar.)\n'+
          'So as a backup plan, writing recovered data to stdout instead:\n'+
          '\n'+
          logFileContents+'\n'
        );
      }//>-

      return proceed();
    });//_∏_  </ fsx.outputFile() >

  })(function(err) {
    if (err) {
      // This should never happen:
      return done(err);
    }//•

    // Finally, wait for a bit.
    // > This timeout buys a bit of time to try to allow other queries which may
    // > have already begun to complete (remember: we will probably be running this
    // > from inside the iteratee of an `async.each`, where multiple failures
    // > could occur in parallel.)
    setTimeout(function () {
      return done(flaverr('E_FAILED_ALTER_STRATEGEM', new Error(
        'Automigrations failed.  (See logs above for help, and a summary of what went wrong.)'
        // FUTURE: Also include error summary here (though note that some of the code above would need to be refactored)
      )));
    }, 1200);//_∏_

  });//_∏_ (†)

};
