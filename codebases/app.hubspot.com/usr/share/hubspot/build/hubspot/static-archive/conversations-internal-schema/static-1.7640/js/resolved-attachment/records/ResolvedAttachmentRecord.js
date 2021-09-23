'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import FileMetadataRecord from '../../file-metadata/records/FileMetadataRecord';

var ResolvedAttachmentRecord = /*#__PURE__*/function (_Record) {
  _inherits(ResolvedAttachmentRecord, _Record);

  function ResolvedAttachmentRecord() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ResolvedAttachmentRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(ResolvedAttachmentRecord).call(this, Object.assign({}, properties, {
      fileMetadata: properties.fileMetadata ? new FileMetadataRecord(properties.fileMetadata) : null,
      thumbnailMetadata: properties.thumbnailMetadata ? new FileMetadataRecord(properties.thumbnailMetadata) : null
    })));
  }

  return ResolvedAttachmentRecord;
}(Record({
  fileId: null,
  fileMetadata: null,
  thumbnailMetadata: null
}, 'ResolvedAttachmentRecord'));

export default ResolvedAttachmentRecord;