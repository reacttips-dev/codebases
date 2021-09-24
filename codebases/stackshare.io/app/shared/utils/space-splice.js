export const safeSplice = (arr, idx) => {
  let _new = [];
  arr.forEach((obj, i) => i !== idx && _new.push(obj));
  return _new;
};
