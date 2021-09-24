import { fromJS as _fromJS, List, Record } from 'immutable';
var PropertyValueRecord = Object.assign(Record({
  name: undefined,
  source: null,
  sourceId: null,
  timestamp: null,
  updatedByUserId: null,
  value: undefined,
  versions: List()
}, 'PropertyValueRecord'), {
  fromJS: function fromJS(json) {
    if (!json || typeof json !== 'object') {
      return json;
    }

    return PropertyValueRecord(_fromJS(json) // TODO colby: disabling this for now until we can figure out how to handle
    // the different formats
    // .update(
    //   'versions',
    //   (versions) -> versions?.map(PropertyValueVersionRecord.fromJS) ? List()
    // )
    );
  }
});
export default PropertyValueRecord;