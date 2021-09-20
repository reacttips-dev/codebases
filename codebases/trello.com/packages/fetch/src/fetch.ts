type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
let fetch: Fetch;

if (typeof window === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = window.fetch;
}

export { fetch };
