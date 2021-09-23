'use es6';

export var getFileNameAndExtension = function getFileNameAndExtension(file) {
  return file.get('name') + "." + file.get('extension');
};