'use es6';

export default function (meetingLinks) {
  var defaultLink = meetingLinks.find(function (link) {
    return link.get('isDefaultLink');
  });
  return defaultLink || meetingLinks.first();
}