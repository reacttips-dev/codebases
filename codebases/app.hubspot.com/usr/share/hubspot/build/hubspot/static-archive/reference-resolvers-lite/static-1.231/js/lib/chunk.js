'use es6';

var chunk = function chunk(list, size) {
  var chunks = [];
  var start = 0;
  var chunkIdx = 0;

  do {
    chunks[chunkIdx++] = list.slice(start, start + size);
    start += size;
  } while (start < list.length);

  return chunks;
};

export default chunk;