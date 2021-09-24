'use es6';

import sound from 'bender-url!../../resources/floating_sound.mp3';
import { FLOATING, SIDEBAR, TEASE } from '../constants/DeliveryMethods';
import { EXAM_BREAKDOWN_READY, EXPORT_APP, EXPORT_APP_FILE } from '../constants/NotificationTemplateConstants';
import { EXPORT_TYPE, IMPORT_TYPE } from '../constants/NotificationTypeConstants';
var AUTO_HIDE_TEASE_TIMEOUT = 5000;
export function showClickHereToDownloadText(type, template) {
  return type === EXPORT_TYPE && (template === EXPORT_APP || template === EXPORT_APP_FILE || template === EXAM_BREAKDOWN_READY);
}
export function showClickHereToViewText(type) {
  return type === IMPORT_TYPE;
}
export function isSidebar(notification) {
  return notification && notification.deliveryMethods && notification.deliveryMethods.indexOf(SIDEBAR) > -1;
}
export function isNotification(object) {
  return object.type && object.template;
}
export function isFloating(notification) {
  return notification.deliveryMethods && notification.deliveryMethods.indexOf(FLOATING) > -1;
}
export function isTease(notification) {
  return notification.deliveryMethods && notification.deliveryMethods.indexOf(TEASE) > -1;
}
export function isInApp(notification) {
  return isTease(notification) || isFloating(notification);
}
export function getTeaseAutoHideTimeout() {
  return AUTO_HIDE_TEASE_TIMEOUT;
}
export function getAudioContext() {
  return window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
}
export function playNativeOrMp3Sound(contextClass, isDummySound) {
  if (!contextClass) {
    // Web Audio API is not available use the mp3
    var audio = new Audio(sound);
    if (isDummySound) audio.muted = 'muted';
    var audioPromise = audio.play(); // IE doesn't return a promise for HTMLMediaElement.play() :facepalm:

    return audioPromise !== undefined ? audioPromise : Promise.resolve();
  }

  if (isDummySound) {
    // This is a hack for playing an mp3 so shouldn't be necessary with native sounds
    return Promise.resolve();
  } // Web Audio API is available.


  var context = new contextClass();
  var FREQUENCY1 = 622.25;
  var FREQUENCY2 = 932.33;
  var osc = context.createOscillator();
  osc.frequency.value = FREQUENCY1;
  var gainNode = context.createGain();
  gainNode.gain.value = 0.8;
  osc.connect(gainNode);
  gainNode.connect(context.destination);
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.7, context.currentTime + 0.02);
  gainNode.gain.setValueAtTime(1, context.currentTime + 0.15);
  osc.frequency.setValueAtTime(FREQUENCY2, context.currentTime + 0.15);
  var endTime = context.currentTime + 1;
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
  osc.start(0);
  osc.stop(endTime);
  return Promise.resolve();
}