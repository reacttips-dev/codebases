export default function konami(callback, optionalSequence) {
  let chars = [], lastKeypress, sequence = [];

  // allow sequence override, but default to konami code
  if (typeof optionalSequence === 'string') {
    optionalSequence = optionalSequence.toUpperCase();

    for (let i = 0; i < optionalSequence.length; i++) {
      sequence.push(optionalSequence.charCodeAt(i));
    }
  } else if (Array.isArray(optionalSequence)) {
    sequence = optionalSequence;
  } else {
    // up up down down left right left right b a
    sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  }

  const handleKeydown = function(e) {
    const gap = e.timeStamp - (lastKeypress || e.timeStamp);
    lastKeypress = e.timeStamp;
    if (gap > 1000) {
      chars = [];
    }
    chars.push(e.keyCode);
    if (chars.length > sequence.length) {
      chars.shift();
    }
    if (chars.join('') === sequence.join('')) {
      callback();
    }
  };

  if (callback) {
    document.addEventListener('keydown', handleKeydown);
  }
}
