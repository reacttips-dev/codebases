
export default function deepRetrieve(_data) {
  // Don't deopt
  let data = _data;
  for (let i = 1; i < arguments.length; i++) {
    const key = arguments[i];
    if (!_.has(data, key)) {
      return undefined;
    }
    data = data[key];
  }
  return data;
}

