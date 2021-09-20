const crypto = require('crypto'),
  uuidv4 = require('uuid/v4'),
  algorithm = 'aes-256-gcm',
  UUID_COMPONENT_SEPARATOR = '-',
  UUID_14 = '4',
  UUID_19 = '8';

export function deterministicUUID (str) {
  if (!str || str.length < 1) {
    return uuidv4();
  }

  let chars = crypto.createHash('sha256').update(str.toString()).digest('hex').substring(0, 36).split('');

  chars[8] = UUID_COMPONENT_SEPARATOR;
  chars[13] = UUID_COMPONENT_SEPARATOR;
  chars[14] = UUID_14;
  chars[18] = UUID_COMPONENT_SEPARATOR;
  chars[19] = UUID_19;
  chars[23] = UUID_COMPONENT_SEPARATOR;

  return chars.join('');
}
