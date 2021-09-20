const config = {
  INITIALIZATION_ATTRIBUTES: [
    'applicationName',
    'applicationVersion',
    'harvestStart',
    'harvestInterval',
    'rateLimit'
  ],
  SPAN_ATTRIBUTES: ['name', 'domain'],
  NEWRELIC_SPAN_ATTRIBUTES: [
    'id',
    'uid',
    'name',
    'domain',
    'startTime',
    'endTime',
    'duration',
    'applicationName',
    'applicationVersion',
    'apdex_t'
  ],
  NEWRELIC_SPAN_DATA_MODEL: {
    id: 'string',
    name: 'string',
    domain: 'string',
    startTime: 'number',
    endTime: 'number',
    duration: 'number',
    applicationName: 'string',
    applicationVersion: 'number',
    reference: 'string',
    apdex_t: 'number'
  },
  PERFORMANCE_ENTRY_TYPES: {
    START: 'start',
    END: 'end',
    MEASURE: 'measure'
  },
  CLIENT_INFORMATION: {
    applicationName: null,
    applicationVersion: null,
    harvestStart: 25000, // in ms
    harvestInterval: 30000, // in ms
    rateLimit: 60
  },
  DEFAULT_APDEX_THRESHOLD: 250 // in ms
};

export default config;
