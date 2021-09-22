import React from 'react';

export function CharacterLimitTruncation({ text, limit }) {
  let label = text;
  if (limit && text.length >= limit) {
    label = text?.slice(0, limit) + '...';
  }
  return label;
}
