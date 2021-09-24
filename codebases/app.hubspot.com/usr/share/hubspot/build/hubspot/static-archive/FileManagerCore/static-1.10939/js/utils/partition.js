'use es6'; // Linear partitioning implementation
// Partition seq into k buckets
// Explanation: http://www8.cs.umu.se/kurser/TDBAfl/VT06/algorithms/BOOK/BOOK2/NODE45.HTM
// Based on https://github.com/jayrbolton/linear-partitioning/ (MIT License)
// jay r bolton <jayrbolton@gmail.com> (http://jayrbolton.com/)
// Work our way back up through the dividers, referencing each divider that we
// saved given a value for k and a length of seq, using each divider to make
// the partitions.

function reconstructPartition(seq, dividers, k) {
  var partitions = [];

  while (k > 1) {
    if (dividers[seq.length]) {
      var divider = dividers[seq.length][k];
      var part = seq.splice(divider);
      partitions.unshift(part);
    }

    k = k - 1;
  }

  partitions.unshift(seq);
  return partitions;
} // Given a list of numbers of length n, loop through it with index 'i'
// Make each element the sum of all the numbers from 0...i
// For example, given [1,2,3,4,5]
// The prefix sums are [1,3,6,10,15]


function prefixSums(seq) {
  var sums = [0];

  for (var i = 1; i <= seq.length; ++i) {
    sums[i] = sums[i - 1] + seq[i - 1];
  }

  return sums;
} // This matrix holds the maximum sums over all the ranges given the length of
// seq and the number of buckets (k)


function boundaryConditions(seq, k, sums) {
  var conds = [];

  for (var i = 1; i <= seq.length; ++i) {
    conds[i] = [];
    conds[i][1] = sums[i];
  }

  for (var j = 1; j <= k; ++j) {
    conds[1][j] = seq[0];
  }

  return conds;
}

export function partition(seq, k) {
  if (k === 0) {
    return [];
  }

  if (k === 1) {
    return [seq];
  }

  if (k >= seq.length) {
    // return the lists of each single element in sequence, plus empty lists for any extra buckets.
    var repeated = [];

    for (var q = 0; q < k - seq.length; ++q) {
      repeated.push([]);
    }

    return seq.map(function (x) {
      return [x];
    }).concat(repeated);
  }

  var sequence = seq.slice(0);
  var dividers = [];
  var sums = prefixSums(sequence, k);
  var conds = boundaryConditions(sequence, k, sums); // evaluate main recurrence

  for (var i = 2; i <= sequence.length; ++i) {
    for (var j = 2; j <= k; ++j) {
      conds[i][j] = undefined;

      for (var x = 1; x < i; ++x) {
        var s = Math.max(conds[x][j - 1], sums[i] - sums[x]); // Initialize a new row in the dividers matrix (unless it's already initialized).

        dividers[i] = dividers[i] || []; // Continue to find the cost of the largest range in the optimal partition.

        if (conds[i][j] === undefined || conds[i][j] > s) {
          conds[i][j] = s;
          dividers[i][j] = x;
        }
      }
    }
  }

  return reconstructPartition(sequence, dividers, k);
}