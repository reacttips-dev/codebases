export const startCase = (text = '') => {
  const textStrings = text.split('-').filter(t => t.trim() !== '');

  return textStrings.reduce(
    (acc = '', t, index) =>
      `${acc}${t[0].toUpperCase()}${t.slice(1)}${textStrings.length === index + 1 ? '' : ' '}`,
    ''
  );
};

export const xor = (...props) => {
  const arr = [];

  props.map(items => {
    items.map(item => {
      if (arr.indexOf(item) === -1) {
        arr.push(item);
      } else {
        arr.splice(arr.indexOf(item), 1);
      }
    }, []);
  });

  return arr;
};

export const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const truncate = (textString, length) => {
  return textString.length > length - 3 ? `${textString.slice(0, length - 3)}...` : textString;
};
