import videojs from 'video.js';

var version = "1.1.6";

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
}

var MenuItem = videojs.getComponent('MenuItem');
var Component = videojs.getComponent('Component');

var SourceMenuItem =
    /*#__PURE__*/
    function(_MenuItem) {
        _inheritsLoose(SourceMenuItem, _MenuItem);

        function SourceMenuItem(player, options) {
            options.selectable = true;
            options.multiSelectable = false;
            return _MenuItem.call(this, player, options) || this;
        }

        var _proto = SourceMenuItem.prototype;

        _proto.handleClick = function handleClick() {
            var selected = this.options_;
            console.log("Changing quality to:", selected.label);

            _MenuItem.prototype.handleClick.call(this);

            var levels = this.player().qualityLevels();

            for (var i = 0; i < levels.length; i++) {
                if (selected.index == levels.length) {
                    // If this is the Auto option, enable all renditions for adaptive selection
                    levels[i].enabled = true;
                } else if (selected.index == i) {
                    levels[i].enabled = true;
                } else {
                    levels[i].enabled = false;
                }
            }
        };

        _proto.update = function update() {
            var selectedIndex = this.player().qualityLevels().selectedIndex;
            this.selected(this.options_.index == selectedIndex);
        };

        return SourceMenuItem;
    }(MenuItem);

Component.registerComponent('SourceMenuItem', SourceMenuItem);

var MenuButton = videojs.getComponent('MenuButton');

var SourceMenuButton =
    /*#__PURE__*/
    function(_MenuButton) {
        _inheritsLoose(SourceMenuButton, _MenuButton);

        function SourceMenuButton(player, options) {
            var _this;

            _this = _MenuButton.call(this, player, options) || this;
            MenuButton.apply(_assertThisInitialized(_this), arguments);

            var qualityLevels = _this.player().qualityLevels(); // Handle options: We accept an options.default value of ( high || low )
            // This determines a bias to set initial resolution selection.


            if (options && options["default"]) {
                if (options["default"] == 'low') {
                    for (var i = 0; i < qualityLevels.length; i++) {
                        qualityLevels[i].enabled = i == 0;
                    }
                } else if (options["default"] = 'high') {
                    for (var i = 0; i < qualityLevels.length; i++) {
                        qualityLevels[i].enabled = i == qualityLevels.length - 1;
                    }
                }
            } // Bind update to qualityLevels changes


            _this.player().qualityLevels().on(['change', 'addqualitylevel'], videojs.bind(_assertThisInitialized(_this), _this.update));

            return _this;
        }

        var _proto = SourceMenuButton.prototype;

        _proto.createEl = function createEl() {
            return videojs.dom.createEl('div', {
                className: 'vjs-http-source-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button'
            });
        };

        _proto.buildCSSClass = function buildCSSClass() {
            return MenuButton.prototype.buildCSSClass.call(this) + ' vjs-icon-cog';
        };

        _proto.update = function update() {
            return MenuButton.prototype.update.call(this);
        };

        _proto.createItems = function createItems() {
            var menuItems = [];
            var levels = this.player().qualityLevels();
            var labels = [];

            for (var i = 0; i < levels.length; i++) {
                var index = levels.length - (i + 1);
                var selected = index === levels.selectedIndex; // Display height if height metadata is provided with the stream, else use bitrate

                var label = "" + index;
                var sortVal = index;

                if (levels[index].height) {
                    label = levels[index].height + "p";
                    sortVal = parseInt(levels[index].height, 10);
                } else if (levels[index].bitrate) {
                    label = Math.floor(levels[index].bitrate / 1e3) + " kbps";
                    sortVal = parseInt(levels[index].bitrate, 10);
                } // Skip duplicate labels


                if (labels.indexOf(label) >= 0) {
                    continue;
                }

                labels.push(label);
                menuItems.push(new SourceMenuItem(this.player_, {
                    label: label,
                    index: index,
                    selected: selected,
                    sortVal: sortVal
                }));
            } // If there are multiple quality levels, offer an 'auto' option


            if (levels.length > 1) {
                menuItems.push(new SourceMenuItem(this.player_, {
                    label: 'Auto',
                    index: levels.length,
                    selected: false,
                    sortVal: 99999
                }));
            } // Sort menu items by their label name with Auto always first


            menuItems.sort(function(a, b) {
                if (a.options_.sortVal < b.options_.sortVal) {
                    return 1;
                } else if (a.options_.sortVal > b.options_.sortVal) {
                    return -1;
                } else {
                    return 0;
                }
            });
            return menuItems;
        };

        return SourceMenuButton;
    }(MenuButton);

var defaults = {}; // Cross-compatibility for Video.js 5 and 6.

var registerPlugin = videojs.registerPlugin || videojs.plugin; // const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */

var onPlayerReady = function onPlayerReady(player, options) {
    player.addClass('vjs-http-source-selector');
    console.log("videojs-http-source-selector initialized!");
    console.log("player.techName_:" + player.techName_); //This plugin only supports level selection for HLS playback

    if (player.techName_ != 'Html5') {
        return false;
    }
    /**
     *
     * We have to wait for the manifest to load before we can scan renditions for resolutions/bitrates to populate selections
     *
     **/


    player.on(['loadedmetadata'], function(e) {
        var qualityLevels = player.qualityLevels();
        videojs.log('loadmetadata event'); // hack for plugin idempodency... prevents duplicate menubuttons from being inserted into the player if multiple player.httpSourceSelector() functions called.

        if (player.videojs_http_source_selector_initialized == 'undefined' || player.videojs_http_source_selector_initialized == true) {
            console.log("player.videojs_http_source_selector_initialized == true");
        } else {
            console.log("player.videojs_http_source_selector_initialized == false");
            player.videojs_http_source_selector_initialized = true;
            var controlBar = player.controlBar,
                fullscreenToggle = controlBar.getChild('fullscreenToggle').el();
            controlBar.el().insertBefore(controlBar.addChild('SourceMenuButton').el(), fullscreenToggle);
        }
    });
};
/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function httpSourceSelector
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */


var httpSourceSelector = function httpSourceSelector(options) {
    var _this = this;

    this.ready(function() {
        onPlayerReady(_this, videojs.mergeOptions(defaults, options)); //this.getChild('controlBar').addChild('SourceMenuButton', {});
    });
    videojs.registerComponent('SourceMenuButton', SourceMenuButton);
    videojs.registerComponent('SourceMenuItem', SourceMenuItem);
}; // Register the plugin with video.js.


registerPlugin('httpSourceSelector', httpSourceSelector); // Include the version number.

httpSourceSelector.VERSION = version;

export default httpSourceSelector;