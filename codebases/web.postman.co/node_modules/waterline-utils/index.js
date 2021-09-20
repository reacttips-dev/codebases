module.exports = {
  query: {
    tokenizer: require('./lib/query/tokenizer'),
    analyzer: require('./lib/query/analyzer'),
    converter: require('./lib/query/converter')
  },
  joins: {
    queryCache: require('./lib/joins/query-cache'),
    detectChildrenRecords: require('./lib/joins/detect-children-records'),
    convertJoinCriteria: require('./lib/joins/convert-join-criteria')
  },
  autoMigrations: require('./lib/auto-migrations'),
  eachRecordDeep: require('./lib/each-record-deep'),
  normalizeDatastoreConfig: require('./lib/normalize-datastore-config'),
};
