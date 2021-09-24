import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { CJK_HIRAGANA_REGEX, KATAKANA_REGEX, formatName } from '../../utils/NavI18n';

var jaNameRegex = function jaNameRegex(name) {
  if (name && (CJK_HIRAGANA_REGEX.test(name) || KATAKANA_REGEX.test(name))) {
    var _name$split = name.split(' '),
        _name$split2 = _slicedToArray(_name$split, 2),
        firstName = _name$split2[0],
        lastName = _name$split2[1];

    return formatName({
      firstName: firstName,
      lastName: lastName
    });
  }

  return name;
};

var longerNameOrName = function longerNameOrName(nameA, nameN) {
  return nameA && nameN ? nameA.length > nameN.length ? nameA : nameN : nameA || nameN;
};

export default function (_ref) {
  var _ref$properties = _ref.properties,
      pName = _ref$properties.name,
      pFirstName = _ref$properties.firstName,
      pLastName = _ref$properties.lastName,
      highlights = _ref.highlights;

  if (highlights) {
    var hNameA = highlights['name.analyzed'],
        hNameN = highlights['name.ngrammed'],
        hFirstNameA = highlights['firstName.analyzed'],
        hFirstNameN = highlights['firstName.ngrammed'],
        hLastNameA = highlights['lastName.analyzed'],
        hLastNameN = highlights['lastName.ngrammed'];
    var hName = hNameA || hNameN;
    var hFirstName = longerNameOrName(hFirstNameA, hFirstNameN);
    var hLastName = longerNameOrName(hLastNameA, hLastNameN);

    if (hFirstName || hLastName) {
      return formatName({
        firstName: hFirstName || pFirstName,
        lastName: hLastName || pLastName
      });
    }

    if (hName) {
      return jaNameRegex(hName);
    }
  }

  if (pFirstName || pLastName) {
    return formatName({
      firstName: pFirstName,
      lastName: pLastName
    });
  }

  return jaNameRegex(pName) || undefined;
}