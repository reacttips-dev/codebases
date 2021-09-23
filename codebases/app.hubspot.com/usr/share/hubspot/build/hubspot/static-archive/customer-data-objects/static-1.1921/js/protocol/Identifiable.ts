import always from 'transmute/always';
import indexBy from 'transmute/indexBy';
import protocol from 'transmute/protocol';
import toString from 'transmute/toString';
var noId = always(undefined);
/**
 * Returns the id of `subject`.
 */

export var getId = protocol({
  args: [protocol.TYPE],
  name: 'Identifiable#getId'
});
getId.implement(null, noId);
getId.implement(undefined, noId);
/**
 * Returns the string id of `subject`.
 */

export function getIdString(subject) {
  var id = getId(subject);
  return id == null ? id : toString(id);
}
/**
 * Returns an OrderedMap of subjects by id.
 */

export var indexById = indexBy(getId);
/**
 * Returns an OrderedMap of subjects by string id.
 */

export var indexByIdString = indexBy(getIdString);