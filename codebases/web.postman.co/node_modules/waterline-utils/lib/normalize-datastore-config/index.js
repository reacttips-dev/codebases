/**
 * Module dependencies
 */

var assert = require('assert');
var util = require('util');
var url = require('url');
var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var qs = require('qs');
var normalizeDatabase = require('./private/normalize-database');
var normalizeUser = require('./private/normalize-user');
var normalizePort = require('./private/normalize-port');
var normalizeHost = require('./private/normalize-host');
var normalizePassword = require('./private/normalize-password');


/**
 * normalizeDatastoreConfig()
 *
 * Normalize (mutate) the provided datastore config dictionary (in-place).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * NOTES:
 * • This implementation was originally taken from sails-mongo
 *     https://github.com/balderdashy/sails-mongo/tree/2816d81359a5846550c90bd1dbfa98967ac13786/lib/private/normalize-datastore-config
 * • All modifications are performed in-place!
 * • Top-level overrides like `host`, `port`, `user`, etc. are normalized and validated.
 * • Top-level overrides like `host`, `port`, `user`, etc. take precedence over whatever is in the URL.
 * • Normalized versions of top-level overrides like `host`, `port`, `user`, etc. °°ARE°° sucked into the URL automatically.
 * • Recognized URL pieces like the host, port, user, etc. **ARE NOT** attached as top-level props automatically.
 * • Recognized URL pieces like the host, port, user, etc. **ARE** validated and normalized individually, rebuilding the URL if necessary.
 * • Miscellanous properties **ARE NOT** sucked in to the URL automatically.
 * • Miscellaneous querystring opts in the URL °°ARE°° attached automatically as top-level props.
 *   · They are left as-is in the URL as well.
 *   · They are treated as strings (e.g. `?foo=0&bar=false` becomes `{foo:'0', bar: 'false'}`)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param  {Dictionary}   dsConfig
 *         ˚¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\
 *         ˙ url: {String?}           ::
 *         ˙ host: {String?}          ::
 *         ˙ port: {String?}          ::
 *         ˙ user: {String?}          ::
 *         ˙ password: {String?}      ::
 *         ˙ database: {String?}      ::
 *
 * @param {Array?} whitelist
 *        Optional.  If provided, this is an array of strings indicating which custom settings
 *        are recognized and should be allowed.  The standard `url`/`host`/`database` etc. are
 *        always allowed, no matter what.  e.g. `['ssl', 'replicaSet']`
 *
 * @param {String?} expectedProtocolPrefix
 *        Optional.  If specified, this restricts `dsConfig.url` to use a mandatory protocol (e.g. "mongodb")
 *        If no protocol is included (or if it is simply `://`), then this mandatory protocol
 *        will be tacked on automatically.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  ╔═╗╦ ╦╔╦╗╦ ╦╦═╗╔═╗
 *  ╠╣ ║ ║ ║ ║ ║╠╦╝║╣
 *  ╚  ╚═╝ ╩ ╚═╝╩╚═╚═╝
 *  FUTURE:
 *
 * @param {Number} defaultPort
 * @param {String} tolerateNoDatabase
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */

module.exports = function normalizeDatastoreConfig (dsConfig, whitelist, expectedProtocolPrefix) {

  // Sanity checks
  assert(_.isObject(dsConfig), '`dsConfig` should exist and be a dictionary!');
  assert(_.isUndefined(whitelist) || _.isArray(whitelist), 'If provided, 2nd argument should be a whitelist of valid custom settings-- e.g. [\'ssl\', \'replicaSet\']');
  assert(_.isUndefined(expectedProtocolPrefix) || _.isString(expectedProtocolPrefix), 'If provided, 2nd argument should be a string (e.g. "mongodb") representing the prefix for the expected protocol.');


  // Default top-level things.
  // If items in BASELINE_PROPS are included in the querystring of the connection url,
  // they are allowed to remain, but are not automatically applied at the top-level.
  // (Note that this whitelist applies to overrides AND to querystring-encoded values)
  var BASELINE_PROPS = [
    'adapter',
    'schema',
    'identity',

    'url',

    'protocolPrefix',

    'user',
    'password',
    'host',
    'port',
    'database',
  ];


  // Have a look at the datastore config to get an idea of what's there.
  var hasUrl = !_.isUndefined(dsConfig.url);
  var hasUserOverride = !_.isUndefined(dsConfig.user);
  var hasPasswordOverride = !_.isUndefined(dsConfig.password);
  var hasHostOverride = !_.isUndefined(dsConfig.host);
  var hasPortOverride = !_.isUndefined(dsConfig.port);
  var hasDatabaseOverride = !_.isUndefined(dsConfig.database);


  //  ┌┐┌┌─┐┬─┐┌┬┐┌─┐┬  ┬┌─┐┌─┐  ╔═╗╦  ╦╔═╗╦═╗╦═╗╦╔╦╗╔═╗╔═╗
  //  ││││ │├┬┘│││├─┤│  │┌─┘├┤   ║ ║╚╗╔╝║╣ ╠╦╝╠╦╝║ ║║║╣ ╚═╗
  //  ┘└┘└─┘┴└─┴ ┴┴ ┴┴─┘┴└─┘└─┘  ╚═╝ ╚╝ ╚═╝╩╚═╩╚═╩═╩╝╚═╝╚═╝
  //      ┬ ┌─┐   ┌─┐┌─┐┌┬┐┌┬┐┬┌┐┌┌─┐┌─┐  ┌┬┐┬ ┬┌─┐┌┬┐  ┌┬┐┌─┐┬┌─┌─┐
  //      │ ├┤    └─┐├┤  │  │ │││││ ┬└─┐   │ ├─┤├─┤ │    │ ├─┤├┴┐├┤
  //  ooo ┴o└─┘o  └─┘└─┘ ┴  ┴ ┴┘└┘└─┘└─┘   ┴ ┴ ┴┴ ┴ ┴    ┴ ┴ ┴┴ ┴└─┘
  //  ┌─┐┬─┐┌─┐┌─┐┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐  ┌─┐┬  ┬┌─┐┬─┐  ┌─┐┌┬┐┌─┐┌┐┌┌┬┐┌─┐┬─┐┌┬┐
  //  ├─┘├┬┘├┤ │  ├┤  ││├┤ ││││  ├┤   │ │└┐┌┘├┤ ├┬┘  └─┐ │ ├─┤│││ ││├─┤├┬┘ ││
  //  ┴  ┴└─└─┘└─┘└─┘─┴┘└─┘┘└┘└─┘└─┘  └─┘ └┘ └─┘┴└─  └─┘ ┴ ┴ ┴┘└┘─┴┘┴ ┴┴└──┴┘
  //  ┌─┐┬ ┬┬ ┬┌┐┌┬┌─┌─┐  ┌─┐┌─┐  ┌┬┐┬ ┬┌─┐  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┬ ┬┬─┐┬
  //  │  ├─┤│ ││││├┴┐└─┐  │ │├┤    │ ├─┤├┤   │  │ │││││││├┤ │   │ ││ ││││  │ │├┬┘│
  //  └─┘┴ ┴└─┘┘└┘┴ ┴└─┘  └─┘└     ┴ ┴ ┴└─┘  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘  └─┘┴└─┴─┘
  try {

    if (hasUserOverride) {
      dsConfig.user = normalizeUser(dsConfig.user);
    }

    if (hasPasswordOverride) {
      dsConfig.password = normalizePassword(dsConfig.password);
    }

    if (hasHostOverride) {
      dsConfig.host = normalizeHost(dsConfig.host);
    }

    if (hasPortOverride) {
      dsConfig.port = normalizePort(dsConfig.port);
    }

    if (hasDatabaseOverride) {
      dsConfig.database = normalizeDatabase(dsConfig.database);
    }

  } catch (e) {
    switch (e.code) {
      case 'E_BAD_CONFIG': throw flaverr('E_BAD_CONFIG', new Error(
        'Invalid override specified.  '+e.message+'\n'+
        '--\n'+
        'Please correct this and try again...  Or better yet, specify a `url`!  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
      default: throw e;
    }
  }//</catch>


  // Strip out any overrides w/ undefined values.
  // (And along the way, check overrides against whitelist if relevant)
  var unrecognizedKeys;
  _.each(Object.keys(dsConfig), function (key) {
    if (_.isUndefined(dsConfig[key])) {
      delete dsConfig[key];
    }

    if (whitelist && !_.contains(whitelist, key) && !_.contains(BASELINE_PROPS, key)) {
      unrecognizedKeys = unrecognizedKeys || [];
      unrecognizedKeys.push(key);
    }

  });

  if (unrecognizedKeys) {
    throw flaverr('E_BAD_CONFIG', new Error(
      'Unrecognized options (`'+unrecognizedKeys+'`) specified as config overrides.\n'+
      'This adapter expects only whitelisted properties.\n'+
      '--\n'+
      'See http://sailsjs.com/config/datastores#?the-connection-url for info,\n'+
      'or visit https://sailsjs.com/support for more help.'
    ));
  }





  //  ┬ ┬┌─┐┌┐┌┌┬┐┬  ┌─┐  ┌─┐┌┐ ┌─┐┌─┐┌┐┌┌─┐┌─┐  ┌─┐┌─┐  ┬ ┬┬─┐┬
  //  ├─┤├─┤│││ │││  ├┤   ├─┤├┴┐└─┐├┤ ││││  ├┤   │ │├┤   │ │├┬┘│
  //  ┴ ┴┴ ┴┘└┘─┴┘┴─┘└─┘  ┴ ┴└─┘└─┘└─┘┘└┘└─┘└─┘  └─┘└    └─┘┴└─┴─┘
  //  ┌─    ┌┐ ┌─┐┌─┐┬┌─┬ ┬┌─┐┬─┐┌┬┐┌─┐   ┌─┐┌─┐┌┬┐┌─┐┌─┐┌┬┐┬┌┐ ┬┬  ┬┌┬┐┬ ┬    ─┐
  //  │───  ├┴┐├─┤│  ├┴┐│││├─┤├┬┘ ││└─┐───│  │ ││││├─┘├─┤ │ │├┴┐││  │ │ └┬┘  ───│
  //  └─    └─┘┴ ┴└─┘┴ ┴└┴┘┴ ┴┴└──┴┘└─┘   └─┘└─┘┴ ┴┴  ┴ ┴ ┴ ┴└─┘┴┴─┘┴ ┴  ┴     ─┘

  // If a URL config value was not given, ensure that all the various pieces
  // needed to create one exist.  Then build a URL and attach it to the datastore config.
  if (!hasUrl) {

    // Invent a connection URL on the fly.
    var inventedUrl = (expectedProtocolPrefix||'db')+'://';
    // ^^FUTURE: Potentially use `protocolPrefix` here if one was specified

    // If no .protocolPrefix property is already defined on dsConfig, and an
    // explicit expected protocol prefix was specified, then attach that.
    if (expectedProtocolPrefix && dsConfig.protocolPrefix === undefined) {
      dsConfig.protocolPrefix = expectedProtocolPrefix;
    }

    // FUTURE: Appropriately URL/URIComponent-encode this stuff as we build the url

    // If authentication info was specified, add it:
    if (hasPasswordOverride && hasUserOverride) {
      inventedUrl += dsConfig.user+':'+dsConfig.password+'@';
    }
    else if (!hasPasswordOverride && hasUserOverride) {
      inventedUrl += dsConfig.user+'@';
    }
    else if (hasPasswordOverride && !hasUserOverride) {
      throw flaverr('E_BAD_CONFIG', new Error(
        'No `url` was specified, so tried to infer an appropriate connection URL from other properties.  '+
        'However, it looks like a `password` was specified, but no `user` was specified to go along with it.\n'+
        '--\n'+
        'Please remove `password` or also specify a `user`.  Or better yet, specify a `url`!  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }

    // If a host was specified, use it.
    if (hasHostOverride) {
      inventedUrl += dsConfig.host;
    }
    else {
      throw flaverr('E_BAD_CONFIG', new Error(
        'No `url` was specified, and no appropriate connection URL can be inferred (tried to use '+
        '`host: '+util.inspect(dsConfig.host)+'`).\n'+
        '--\n'+
        'Please specify a `host`...  Or better yet, specify a `url`!  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
      // Or alternatively...
      // ```
      // inventedUrl += 'localhost';
      // ```
    }

    // If a port was specified, use it.
    if (hasPortOverride) {
      inventedUrl += ':'+dsConfig.port;
    }

    // If a database was specified, use it.
    if (hasDatabaseOverride) {
      inventedUrl += '/'+dsConfig.database;
    }
    else {
      throw flaverr('E_BAD_CONFIG', new Error(
        'No `url` was specified, and no appropriate connection URL can be inferred (tried to use '+
        '`database: '+util.inspect(dsConfig.database)+'`).\n'+
        '--\n'+
        'Please specify a `database`...  Or better yet, specify a `url`!  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }

    // - - - - - - - - - - - - - - - - - - - - - - - -
    // FUTURE: Log a compatibility warning..?  Maybe.
    //
    // > To help standardize configuration for end users, adapter authors
    // > are encouraged to support the `url` setting, if conceivable.
    // >
    // > Read more here:
    // > http://sailsjs.com/config/datastores#?the-connection-url
    // - - - - - - - - - - - - - - - - - - - - - - - -

    // Now save our invented URL as `url`.
    dsConfig.url = inventedUrl;

  }
  //  ┌─┐┌─┐┬─┐┌─┐┌─┐   ┬   ┌┐┌┌─┐┬─┐┌┬┐┌─┐┬  ┬┌─┐┌─┐  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ╦ ╦╦═╗╦
  //  ├─┘├─┤├┬┘└─┐├┤   ┌┼─  ││││ │├┬┘│││├─┤│  │┌─┘├┤   │  │ │││││││├┤ │   │ ││ ││││  ║ ║╠╦╝║
  //  ┴  ┴ ┴┴└─└─┘└─┘  └┘   ┘└┘└─┘┴└─┴ ┴┴ ┴┴─┘┴└─┘└─┘  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘  ╚═╝╩╚═╩═╝
  // Otherwise, normalize & parse the connection URL.
  else {

    // Perform a basic sanity check & string coercion.
    if (!_.isString(dsConfig.url) || dsConfig.url === '') {
      throw flaverr('E_BAD_CONFIG', new Error(
        'Invalid `url` specified.  Must be a non-empty string.\n'+
        '--\n'+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }

    // Before beginning to do further string parsing, look for a little loophole:
    // If the given URL includes a comma, we'll assume it's a complex URL like you get
    // from Mongo Atlas and trust that it contains all the info we need.
    //
    // > But note that this _does not_ handle automatically attaching host, password,
    // > port, etc. to the `dsConfig` dictionary.  It also doesn't do any verification
    // > of these aspects of the URL, which means it could be entirely invalid.
    if (dsConfig.url.indexOf(',') > -1) {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // FUTURE: Implement explicit parsing for this kind of URL instead of just bailing silently.
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      return;
    }//•

    // IWMIH, this is the general case where we're actually going to validate the URL like normal.

    // First, make sure there's a protocol:
    // We don't actually care about the protocol... but the underlying library (e.g. `mongodb`) might.
    // Plus, more importantly, Node's `url.parse()` returns funky results if the argument doesn't
    // have one.  So we'll add one if necessary.
    // > See https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
    var urlToParse;
    if (dsConfig.url.match(/^:\/\//)) {
      urlToParse = dsConfig.url.replace(/^:\/\//, (expectedProtocolPrefix||'db')+'://');
    }
    else if (!dsConfig.url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
      urlToParse = (expectedProtocolPrefix||'db')+'://'+dsConfig.url;
    }
    else {
      urlToParse = dsConfig.url;
    }

    // console.log('dsConfig.url',dsConfig.url);
    // console.log('\n\n**********\nurl to parse:',urlToParse, (new Error()).stack);

    // Now attempt to parse out the URL's pieces and validate each one.
    var parsedConnectionStr = url.parse(urlToParse);


    // Ensure a valid protocol.

    // Validate that a protocol was found before other pieces
    // (otherwise other parsed info could be very weird and wrong)
    if (!parsedConnectionStr.protocol) {
      throw flaverr('E_BAD_CONFIG', new Error(
        'Could not parse provided URL ('+util.inspect(dsConfig.url,{depth:5})+').\n'+
        '(If you continue to experience issues, try checking that the URL begins with an '+
        'appropriate protocol; e.g. `mysql://` or `mongo://`.\n'+
        '--\n'+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }

    // If relevant, validate that the RIGHT protocol was found.
    if (expectedProtocolPrefix) {
      if (parsedConnectionStr.protocol !== expectedProtocolPrefix+':') {
        throw flaverr('E_BAD_CONFIG', new Error(
          'Provided URL ('+util.inspect(dsConfig.url,{depth:5})+') has an invalid protocol.\n'+
          'If included, the protocol must be "'+expectedProtocolPrefix+'://".\n'+
          '--\n'+
          '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
        ));
      }
      // FUTURE: Potentially also check `.protocolPrefix` prop if one was specified
    }//>-

    // If the connection string contains a specific protocol, save it in the
    // dsconfig -- unless a `protocolPrefix` property is already defined.
    if (parsedConnectionStr !== 'db:' && dsConfig.protocolPrefix === undefined) {
      dsConfig.protocolPrefix = (parsedConnectionStr.protocol||'').replace(/\:$/,'');
    }

    // Parse authentication credentials from url, if specified.
    var userInUrl;
    var passwordInUrl;
    if (parsedConnectionStr.auth && _.isString(parsedConnectionStr.auth)) {
      var authPieces = parsedConnectionStr.auth.split(/:/);
      if (authPieces[0]) {
        userInUrl = authPieces[0];
      }//>-
      if (authPieces[1]) {
        passwordInUrl = authPieces[1];
      }
    }


    // Parse the rest of the standard information from the URL.
    var hostInUrl = parsedConnectionStr.hostname;
    var portInUrl = parsedConnectionStr.port;
    var databaseInUrl = parsedConnectionStr.pathname;

    // And finally parse the non-standard info from the URL's querystring.
    var miscOptsInUrlQs;
    try {
      miscOptsInUrlQs = qs.parse(parsedConnectionStr.query);
    } catch (e) {
      throw flaverr('E_BAD_CONFIG', new Error(
        'Could not parse query string from URL: `'+dsConfig.url+'`.  '+
        'Details: '+e.stack
      ));
    }



    // Now normalize + restore parsed values back into overrides.
    // > • Note that we prefer overrides to URL data here.
    // > • Also remember that overrides have already been normalized/validated above.
    // > • And finally, also note that we enforce the whitelist for non-standard props
    // >   here, if relevant.  This is so we can provide a clear error message about where
    // >   the whitelist violation came from.
    try {

      if (userInUrl && !hasUserOverride) {
        dsConfig.user = normalizeUser(userInUrl);
      }
      if (passwordInUrl && !hasPasswordOverride) {
        dsConfig.password = normalizePassword(passwordInUrl);
      }
      if (hostInUrl && !hasHostOverride) {
        dsConfig.host = normalizeHost(hostInUrl);
      }
      if (portInUrl && !hasPortOverride) {
        dsConfig.port = normalizePort(portInUrl);
      }
      if (databaseInUrl && !hasDatabaseOverride) {
        databaseInUrl = _.trim(databaseInUrl, '/');
        dsConfig.database = normalizeDatabase(databaseInUrl);
      }

      _.each(miscOptsInUrlQs, function (val, key) {

        if (whitelist && !_.contains(whitelist, key)) {
          throw flaverr('E_BAD_CONFIG', new Error(
            'Unrecognized option (`'+key+'`) specified in query string of connection URL.\n'+
            '(This adapter expects only standard, whitelisted properties.)\n'+
            '--\n'+
            'See http://sailsjs.com/config/datastores#?the-connection-url for info, or visit\n)'+
            'https://sailsjs.com/support for more help.'
          ));
        }

        if (_.contains(BASELINE_PROPS, key)) {
          // Currently, we ignore these-- we'll technically put them back in the URL later below,
          // but we're careful not to also stick them at the top level (because they would interfere
          // with other reserved properties).
          //
          // We're leaving it this way for now in the interest of flexibility.  But there's another way:
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          // FUTURE: consider bringing this back instead, for clarity:
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          // throw flaverr('E_BAD_CONFIG', new Error(
          //   'Unexpected option (`'+key+'`) is NEVER allowed in the query string of a connection URL.\n'+
          //   '--\n'+
          //   'See http://sailsjs.com/config/datastores#?the-connection-url for info, or visit\n)'+
          //   'https://sailsjs.com/support for more help.'
          // ));
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        }
        else if (_.isUndefined(dsConfig[key])) {
          dsConfig[key] = val;
        }

      });//</_.each()>

    } catch (e) {
      switch (e.code) {
        case 'E_BAD_CONFIG': throw flaverr('E_BAD_CONFIG', new Error(
          'Could not process connection url.  '+e.message+'\n'+
          '--\n'+
          'Please correct this and try again.\n'+
          '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
        ));
        default: throw e;
      }
    }//</catch>




    // And finally, rebuild the URL
    var rebuiltUrl = '';

    // Start with the protocol...
    rebuiltUrl += parsedConnectionStr.protocol+'//';
    // FUTURE: Potentially use `protocolPrefix` here if one was specified

    // If user/password were specified in the url OR as overrides, use them.
    if (dsConfig.user && dsConfig.password) {
      rebuiltUrl += dsConfig.user+':'+dsConfig.password+'@';
    }
    else if (!dsConfig.password && dsConfig.user) {
      rebuiltUrl += dsConfig.user+'@';
    }
    else if (dsConfig.password && !dsConfig.user) {
      throw flaverr('E_BAD_CONFIG', new Error(
        'It looks like a `password` was specified, but no `user` was specified to go along with it.\n'+
        '--\n'+
        'Please remove `password` or also specify a `user`.  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }

    // If a host was specified in the url OR as an override, use it.
    // (prefer override)
    if (dsConfig.host) {
      rebuiltUrl += dsConfig.host;
    }
    else {
      throw flaverr('E_BAD_CONFIG', new Error(
        'No host could be determined from configuration (tried to use '+
        '`host: '+util.inspect(dsConfig.host)+'`).\n'+
        '--\n'+
        'Please specify a `host` or, better yet, include it in the `url`.  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
      // Or alternatively...
      // ```
      // rebuiltUrl += 'localhost';
      // ```
    }

    // If a port was specified in the url OR as an override, use it.
    // (prefer override)
    if (dsConfig.port) {
      rebuiltUrl += ':'+dsConfig.port;
    }

    // If a database was specified in the url OR as an override, use it.
    // (prefer override)
    if (dsConfig.database) {
      rebuiltUrl += '/'+dsConfig.database;
    }
    else {
      throw flaverr('E_BAD_CONFIG', new Error(
        'No database could be determined from configuration (tried to use '+
        '`database: '+util.inspect(dsConfig.database)+'`).\n'+
        '--\n'+
        'Please specify a `database` or, better yet, include it in the `url`.  '+
        '(See http://sailsjs.com/config/datastores#?the-connection-url for more info.)'
      ));
    }



    // Reattach any non-standard querystring options from the URL.
    // > If there were any non-standard options, we'll **LEAVE THEM IN** the URL
    // > when we rebuild it.  But note that we did fold them into the dsConfig
    // > dictionary as well earlier.
    var newQs = qs.stringify(miscOptsInUrlQs);
    if (newQs.length > 0) {
      rebuiltUrl += '?'+newQs;
    }


    // Now save our rebuilt URL as `url`.
    dsConfig.url = rebuiltUrl;

  }


};
