import { values } from 'lodash';

// https://stackoverflow.com/questions/6977544/rar-zip-files-mime-type/7027582#7027582
// https://www.sitepoint.com/mime-types-complete-list/
// https://mimeapplication.net/x-zip
// https://mimeapplication.net/x-compress
export const ZIP_FILE_MIME_TYPES = [
  'application/zip',
  'application/x-zip',
  'application/x-compress',
  'application/x-compressed',
  'application/x-zip-compressed',
  'multipart/x-zip',
  '.zip',

  // Do not add `application/octet-stream` as it will also allow EXE uploads.
];

export const TEMPLATE_TYPES = {
  types: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // we ONLY accept xlsx (no csv, xls, etc.)
  ],
  extensions: ['.xlsx'],
};

export const TAR_GZ_TYPES = {
  types: ['application/x-gzip', 'application/gzip', 'application/tar'],
  extensions: ['tar.gz'],
};

const ASSET_TYPES = {
  Image: {
    name: 'image',
    types: ['image/*'],
  },

  Video: {
    name: 'video',
    types: ['video/mp4', 'video/x-m4v', 'video/x-flv', 'video/*'],
    extensions: ['mp4', 'mov', 'mkv', 'flv'],
  },

  Subtitle: {
    name: 'subtitle',
    types: ['text/srt', 'text/vtt', '.srt', '.vtt'],
    extensions: ['srt', 'vtt'],
  },

  Audio: {
    name: 'audio',
    types: ['audio/*'],
  },

  Pdf: {
    name: 'pdf',
    types: ['application/pdf'],
  },

  Generic: {
    name: 'generic',
    types: [],
  },

  Authoring: {
    name: 'authoring',
    // in macOS catalina, our yaml ulba files aren't recognized as text/yaml
    types: ['text/xml', 'text/yaml', ...ZIP_FILE_MIME_TYPES, '.yml', '.yaml', '.xml', '.docx'],
  },

  CSV: {
    name: 'csv',
    types: ['text/csv', '.csv'],
  },

  UlbaXlsx: {
    name: 'ulbaXlsx',
    ...TEMPLATE_TYPES,
  },

  UlbaXlsxOrTarGz: {
    name: 'ulbaXlsxOrTarGz',
    types: [...TEMPLATE_TYPES.types, ...TAR_GZ_TYPES.types],
    extensions: [...TEMPLATE_TYPES.extensions, ...TAR_GZ_TYPES.extensions],
  },
};

export const ALL_TYPES = values(ASSET_TYPES).reduce(
  (allTypes: Array<string>, asset) => [...asset.types, ...allTypes],
  []
);

export default ASSET_TYPES;
