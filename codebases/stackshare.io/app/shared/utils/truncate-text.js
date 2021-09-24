import React from 'react';

export const truncateText = (text, count = 300, punctuation = '[\u2026]', simple = false) => {
  let ellipsesText = '';
  let addPunctuation = false;
  if (count >= text.length || count === 0) {
    ellipsesText = text.trim();
  } else if (simple) {
    ellipsesText = text.slice(0, count);
    addPunctuation = true;
  } else {
    const regex = new RegExp('^[\\s\\S]{' + count + '}\\w*');
    ellipsesText = text.match(regex)[0];
    addPunctuation = true;
  }

  return `${ellipsesText}${
    addPunctuation && punctuation && text !== ellipsesText ? ' ' + punctuation : ''
  }`;
};

export const truncateWords = (text, {limit = 15, after = '...'} = {}) => {
  if (!text) return '';

  text = text.trim().split(' ');
  if (text.length <= limit) return text.join(' ');
  return text.slice(0, limit).join(' ') + after;
};

export const truncateWordAfterTheseManyLetter = (
  text,
  limit = 300,
  after = '...',
  addRestAsHidden = false
) => {
  if (!text) return '';

  if (limit >= text.length || limit === 0) return text.trim();

  const newTextArr = text.trim().split(' ');

  let newText = '';
  let hiddenText = '';
  newTextArr.map(item => {
    if (newText.length <= limit) newText = newText + item + ' ';
    else hiddenText = hiddenText + item + ' ';
  });

  return (
    <>
      {newText}
      {addRestAsHidden && <span>{hiddenText}</span>}
      {after}
    </>
  );
};
