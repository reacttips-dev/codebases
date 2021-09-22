/*
 * Video.js Hotkeys
 * https://github.com/ctd1500/videojs-hotkeys
 *
 * Copyright (c) 2014 Chris Dougherty
 * Licensed under the Apache-2.0 license.
 *
 * This plugin has been modified to include shortcuts to increase/decrease playback rate.
 */

import videojs from 'video.js';

import $ from 'jquery';
import tab from 'js/lib/tab';

const hotkeys = function (options = {}) {
  const player = this;
  const defOptions = {
    volumeStep: 0.1,
    seekStep: 5,
    enableMute: true,
    enableFullscreen: true,
    playbackStep: 0.25,
    playbackLowerLimit: 0.75,
    playbackUpperLimit: 2,
  };
  let lastActiveElement = null;

  // Set default player tabindex to handle keydown events
  if (!player.el().hasAttribute('tabIndex')) {
    player.el().setAttribute('tabIndex', '-1');
  }

  player.on('play', function () {
    // Fix allowing the YouTube plugin to have hotkey support.
    const ifblocker = player.el().querySelector('.iframeblocker');
    if (ifblocker && ifblocker.style.display === '') {
      ifblocker.style.display = 'block';
      ifblocker.style.bottom = '39px';
    }
  });

  const keyDown = function (event) {
    const volumeStep = options.volumeStep || defOptions.volumeStep;
    const seekStep = options.seekStep || defOptions.seekStep;
    const enableMute = options.enableMute || defOptions.enableMute;
    const enableFull = options.enableFullscreen || defOptions.enableFullscreen;
    const playbackStep = options.playbackStep || defOptions.playbackStep;
    const playbackLowerLimit = options.playbackLowerLimit || defOptions.playbackLowerLimit;
    const playbackUpperLimit = options.playbackUpperLimit || defOptions.playbackUpperLimit;

    // When controls are disabled, hotkeys will be disabled as well
    if (player.controls()) {
      const activeEl = document.activeElement;
      if (activeEl === player.el() || activeEl === player.el().querySelector('.iframeblocker')) {
        // Spacebar toggles play/pause
        if (event.which === 32) {
          event.preventDefault();
          if (player.paused()) {
            player.play();
          } else {
            player.pause();
          }
          // Seeking with the left/right arrow keys
        } else if (event.which === 37) {
          // Left Arrow
          event.preventDefault();
          let curTime = player.currentTime() - seekStep;

          // The flash player tech will allow you to seek into negative
          // numbers and break the seekbar, so try to prevent that.
          if (player.currentTime() <= seekStep) {
            curTime = 0;
          }
          player.currentTime(curTime);
        } else if (event.which === 39) {
          // Right Arrow
          event.preventDefault();
          player.currentTime(player.currentTime() + seekStep);
          // Volume control with the up/down arrow keys
        } else if (event.which === 40) {
          // Down Arrow
          event.preventDefault();
          player.volume(player.volume() - volumeStep);
        } else if (event.which === 38) {
          // Up Arrow
          event.preventDefault();
          player.volume(player.volume() + volumeStep);
          // Toggle Mute with the M key
        } else if (event.which === 77) {
          if (enableMute) {
            if (player.muted()) {
              player.muted(false);
            } else {
              player.muted(true);
            }
          }
          // Toggle Fullscreen with the F key
        } else if (event.which === 70) {
          if (enableFull) {
            if (player.isFullscreen()) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
          }
        } else if (event.shiftKey) {
          // Increase/decrease playback rate with the > and < keys
          if (event.which === 190 && player.playbackRate() < playbackUpperLimit) {
            player.playbackRate(player.playbackRate() + playbackStep);
          } else if (event.which === 188 && player.playbackRate() > playbackLowerLimit) {
            player.playbackRate(player.playbackRate() - playbackStep);
          }
        }
      }
    }
  };

  player.on('keydown', keyDown);

  // when the control bar is hidden due to user inactivity
  // and a control element is active, remember it for future restoring
  player.on('userinactive', function () {
    if (player.controls()) {
      const activeElement = document.activeElement;
      const $controlBar = $(player.controlBar.el_);
      const restoreFocus = function () {
        player.el_.focus();
      };

      if ($controlBar.find(activeElement).size() > 0) {
        lastActiveElement = document.activeElement;
        // upon inactive, control bar will disappear and focus transferred to <body>
        // let's shift focus to the video player instead
        // so that hotkeys still work
        if ($controlBar.css('transition')) {
          $controlBar.one('transitionend', restoreFocus);
        } else {
          restoreFocus();
        }
      } else {
        lastActiveElement = null;
      }
    }
  });

  // when the control bar returns after inactivity
  // restore previously focused control bar element
  player.on('useractive', function () {
    if (player.controls()) {
      if (lastActiveElement) {
        const $controlBar = $(player.controlBar.el_);
        const returnFocus = function () {
          if (lastActiveElement) {
            lastActiveElement.focus();
            lastActiveElement = null;
          }
        };

        // because the controlBar is CSS animated into existance
        // we can not restore focus to a control element until the the bar is fully visible
        // if we remove the CSS animation, we will need to remove this
        if ($controlBar.css('transition')) {
          $controlBar.one('transitionend', returnFocus);
        } else {
          returnFocus();
        }
      }
    }
  });

  $(document).on('keydown.videoJSPlayer', function (e) {
    // if user is tabbing around, then they might be looking for accessible elements
    // ensure video player is active, so the controls can be focused
    if (e.which === 9) {
      if (!player.userActive()) {
        if (lastActiveElement) {
          let tabToElement = null;
          if (e.shiftKey) {
            tabToElement = tab.getPrevious(lastActiveElement);
          } else {
            tabToElement = tab.getNext(lastActiveElement);
          }

          if (tabToElement) {
            lastActiveElement = tabToElement;
          }
        }
        player.userActive(true);
      }
    }
  });

  player.on('dispose', function (e) {
    $(document).off('keydown.videoJSPlayer');
  });

  return this;
};

videojs.registerPlugin('hotkeys', hotkeys);
