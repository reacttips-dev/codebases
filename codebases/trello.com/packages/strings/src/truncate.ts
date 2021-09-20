export const truncate = (text: string, maxLength: number, ellipsis = '…') => {
  if (text.length > maxLength) {
    return (
      text.substr(0, maxLength - ellipsis.length + 1).replace(/\s+\S*$/, '') +
      ellipsis
    );
  }

  return text;
};
