/* eslint-disable import/no-default-export, @trello/disallow-filenames */
// escapes (adds leading escape slash) every character inside the outer [ ]
// e.g: ? -> \?, } -> \}, ' ' -> \' '

export default (text: string): string =>
  text && text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
