// Borrowed form: https://github.com/facebook/relay/blob/597d2a17aa29d401830407b6814a5f8d148f632d/packages/relay-runtime/util/stableCopy.js
// Apollo Client uses `fast-json-safe-stringify` but that would require an added beruntime dep and make the apollo-dlb more complex.
function stableCopy(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stableCopy);
  }

  var keys = Object.keys(value).sort();
  var stable = {};

  for (var i = 0; i < keys.length; i++) {
    stable[keys[i]] = stableCopy(value[keys[i]]);
  }

  return stable;
}

function stableStringify(value) {
  return JSON.stringify(stableCopy(value));
}

export { stableStringify };