/* eslint-disable */
(function(){

  window.embetter = {};
  var embetter = window.embetter;

  /////////////////////////////////////////////////////////////
  // COMMON UTIL HELPERS
  /////////////////////////////////////////////////////////////

  embetter.debug = true;
  embetter.curEmbeds = [];
  embetter.mobileScrollTimeout = null;
  embetter.mobileScrollSetup = false;
  embetter.apiEnabled = false;
  embetter.apiAutoplayCallback = null;

  embetter.utils = {
    /////////////////////////////////////////////////////////////
    // REGEX HELPERS
    /////////////////////////////////////////////////////////////
    buildRegex: function(regexStr) {
      var optionalPrefix = '(?:https?:\\/\\/)?(?:w{3}\\.)?';
      var terminator = '(?:\\/?|$|\\s|\\?|#)';
      return new RegExp(optionalPrefix + regexStr + terminator);
    },
    /////////////////////////////////////////////////////////////
    // BUILD HTML TEMPLATES
    /////////////////////////////////////////////////////////////
    stringToDomElement: function(str) {
      var div = document.createElement('div');
      div.innerHTML = str;
      return div.firstChild;
    },
    playerHTML: function(service, mediaUrl, thumbnail, id) {
      return '<div class="embetter" ' + service.dataAttribute + '="' + id + '">\
          <a href="' + mediaUrl + '" target="_blank"><img src="' + thumbnail + '"></a>\
        </div>';
    },
    isMobile: (function() {
      return navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android/) ? true : false;
    })(),
    matches: (function() {
      var b = document.createElement('div');
      return b.matches || b.webkitMatchesSelector || b.mozMatchesSelector || b.msMatchesSelector;
    })(),
    parentSelector: function(node, selector) {
      if (this.matches.bind(node)(selector)) {
        return node;
      }
      node = node.parentNode;
      while (node && node !== document) {
        if (this.matches.bind(node)(selector)) {
          return node;
        } else {
          node = node.parentNode;
        }
      }
      return false;
    },

    /////////////////////////////////////////////////////////////
    // MEDIA PLAYERS PAGE MANAGEMENT
    /////////////////////////////////////////////////////////////
    initMediaPlayers: function(el, services) {
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var serviceEmbedContainers = el.querySelectorAll('div['+service.dataAttribute+']');
        for(var j=0; j < serviceEmbedContainers.length; j++) {
          embetter.utils.initPlayer(serviceEmbedContainers[j], service);
        }
      }
      // handle mobile auto-embed on scroll
      if(embetter.utils.isMobile && embetter.mobileScrollSetup === false) {
        window.addEventListener('scroll', embetter.utils.scrollListener);
        embetter.mobileScrollSetup = true;
        // force scroll to trigger listener on page load
        window.scroll(window.scrollX, window.scrollY+1);
        window.scroll(window.scrollX, window.scrollY-1);
      };
    },
    scrollListener: function() {
      // throttled scroll listener
      if(embetter.mobileScrollTimeout != null) {
        window.clearTimeout(embetter.mobileScrollTimeout);
      }
      // check to see if embeds are on screen. if so, embed! otherwise, unembed
      // exclude codepen since we don't know what might execute
      embetter.mobileScrollTimeout = setTimeout(function() {
        for (var i = 0; i < embetter.curEmbeds.length; i++) {
          var player = embetter.curEmbeds[i];
          if(player.getType() != 'codepen') {
            var playerRect = player.el.getBoundingClientRect();
            if(playerRect.bottom < window.innerHeight && playerRect.top > 0) {
              player.embedMedia(false);
            } else {
              player.unembedMedia();
            }
          }
        };
      }, 500);
    },
    initPlayer: function(embedEl, service) {
      if(embedEl.classList.contains('embetter-ready') === true) return;
      if(embedEl.classList.contains('embetter-static') === true) return;
      embetter.curEmbeds.push( new embetter.EmbetterPlayer(embedEl, service) );
    },
    unembedPlayers: function(containerEl) {
      for (var i = 0; i < embetter.curEmbeds.length; i++) {
        if(containerEl && containerEl.contains(embetter.curEmbeds[i].el)) {
          embetter.curEmbeds[i].unembedMedia();
        }
      };
    },
    disposePlayers: function() {
      for (var i = 0; i < embetter.curEmbeds.length; i++) {
        embetter.curEmbeds[i].dispose();
      };
      window.removeEventListener('scroll', embetter.utils.scrollListener);
      embetter.mobileScrollSetup = false;
      embetter.curEmbeds.splice(0, embetter.curEmbeds.length-1);
    },
    mediaComplete: function() {
      if(embetter.curPlayer != null) {
        var playerEl = embetter.curPlayer.el;
        var playlistContainer = this.parentSelector(playerEl, '[data-embetter-playlist]');  // check if we're in a playlist container
        if(playlistContainer) {
          var playlistPlayerEls = playlistContainer.querySelectorAll('.embetter');
          for(var i=0; i < playlistPlayerEls.length - 1; i++) { // skip the last one, since there's nothing else to play
            if(playlistPlayerEls[i].classList.contains('embetter-playing')) { // find the active player and tell the next one to play
              var nextPlayerObj = embetter.utils.getPlayerFromEl(playlistPlayerEls[i+1]);
              if(nextPlayerObj) {
                nextPlayerObj.play();
                if(embetter.apiAutoplayCallback) embetter.apiAutoplayCallback(nextPlayerObj.el);
              }
              break;
            }
          }
        }
      }
    },
    getPlayerFromEl: function(el) {
      for (var i=0; i < embetter.curEmbeds.length; i++) {
        if(el === embetter.curEmbeds[i].el) {
          return embetter.curEmbeds[i];
        }
      }
      return null;
    },
    disposeDetachedPlayers: function() {
      // dispose any players no longer in the DOM
      for (var i = embetter.curEmbeds.length - 1; i >= 0; i--) {
        var embed = embetter.curEmbeds[i];
        if(document.body.contains(embed.el) === false || embed.el === null) {
          embed.dispose();
          delete embetter.curEmbeds.splice(i,1);
        }
      };
    },
    loadRemoteScript: function(scriptURL) {
      var tag = document.createElement('script');
      tag.src = scriptURL;
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  };


  /////////////////////////////////////////////////////////////
  // 3RD-PARTY SERVICE SUPPORT
  /////////////////////////////////////////////////////////////

  embetter.services = {};

  /////////////////////////////////////////////////////////////
  // YOUTUBE
  // http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  // https://developers.google.com/youtube/iframe_api_reference
  // http://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
  /////////////////////////////////////////////////////////////
  embetter.services.youtube = {
    type: 'youtube',
    dataAttribute: 'data-youtube-id',
    regex: /(?:.+?)?(?:youtube\.com\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/,
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '&autoplay=1' : '';
      return '<iframe class="video" enablejsapi="1" width="'+ w +'" height="'+ h +'" src="https://www.youtube.com/embed/'+ id +'?rel=0&suggestedQuality=hd720&enablejsapi=1'+ autoplayQuery +'" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'https://www.youtube.com/watch?v=' + id;
    },
    loadAPI: function(apiLoadedCallback) {
      var self = this;
      if(typeof window.onYouTubeIframeAPIReady !== 'undefined') {
        apiLoadedCallback();
        self.activateCurrentPlayer();
        return;
      }
      // docs here: https://developers.google.com/youtube/iframe_api_reference
      // requires enablejsapi above to connect to an existing iframe
      // load the IFrame Player API code asynchronously.
      embetter.utils.loadRemoteScript("https://www.youtube.com/iframe_api");
      // creates an <iframe> (and YouTube player) after the API code downloads.
      function onYouTubeIframeAPIReady() {
        apiLoadedCallback();
        self.activateCurrentPlayer();
      }
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    },
    activateCurrentPlayer: function() {
      this.currentIframe = document.querySelector('.embetter-playing[data-youtube-id] iframe');
      this.currentIframe.id = document.querySelector('.embetter-playing').getAttribute('data-youtube-id'); // set the id on the iframe
      if (this.currentIframe.id) {
        this.apiPlayer = new YT.Player(this.currentIframe.id, {
          events: {
            'onReady': function() {},
            'onPlaybackQualityChange': function() {},
            'onError': function() {},
            'onStateChange': function(e) {
              /* -1 (unstarted) | 0 (ended) | 1 (playing) | 2 (paused) | 3 (buffering) | 5 (video cued) */
              if(e.data === 0) {
                embetter.utils.mediaComplete();
              }
            }
          }
        });
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // VIMEO
  /////////////////////////////////////////////////////////////
  embetter.services.vimeo = {
    type: 'vimeo',
    dataAttribute: 'data-vimeo-id',
    regex: embetter.utils.buildRegex('vimeo.com\/(\\S*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '&amp;autoplay=1' : '';
      return '<iframe id="' + id + '" src="//player.vimeo.com/video/'+ id +'?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;api=1&amp;player_id=' + id + autoplayQuery +'" width="'+ w +'" height="'+ h +'" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'https://vimeo.com/' + id;
    },
    loadAPI: function(apiLoadedCallback) {
      var self = this;
      if(typeof window.Froogaloop !== 'undefined') {
        apiLoadedCallback();
        self.activateCurrentPlayer();
        return;
      }
      // docs here: https://developer.vimeo.com/player/js-api
      // requires &api=1 above to connect to an existing iframe
      embetter.utils.loadRemoteScript("https://f.vimeocdn.com/js/froogaloop2.min.js");

      var vimeoApiLoad = setInterval(function() {
        if(typeof window.Froogaloop !== 'undefined') {
          window.clearInterval(vimeoApiLoad);
          apiLoadedCallback();
          self.activateCurrentPlayer();
        }
      }, 50);
    },
    activateCurrentPlayer: function() {
      this.currentIframe = document.querySelector('.embetter-playing[data-vimeo-id] iframe');
      this.currentIframe.id = document.querySelector('.embetter-playing').getAttribute('data-vimeo-id'); // set the id on the iframe to match `player_id` query param
      if (this.currentIframe.id) {
        var self = this;
        this.apiPlayer = $f(this.currentIframe);
        this.apiPlayer.addEvent('ready', function() {
          self.apiPlayer.addEvent('pause', function(id) {});
          self.apiPlayer.addEvent('finish', function(id) {
            embetter.utils.mediaComplete();
          });
          self.apiPlayer.addEvent('playProgress', function(data, id) {});
        });
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // SOUNDCLOUD
  // https://soundcloud.com/pages/embed
  // https://developers.soundcloud.com/docs/api/sdks
  // http://soundcloud.com/oembed?format=js&url=https%3A//soundcloud.com/cacheflowe/patter&iframe=true
  /////////////////////////////////////////////////////////////
  embetter.services.soundcloud = {
    type: 'soundcloud',
    dataAttribute: 'data-soundcloud-id',
    regex: embetter.utils.buildRegex('(?:soundcloud.com|snd.sc)\\/([a-zA-Z0-9_-]*(?:\\/sets)?(?:\\/groups)?\\/[a-zA-Z0-9_-]*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '&amp;auto_play=true' : '';
      if(!id.match(/^(playlist|track|group)/)) id = 'tracks/' + id; // if no tracks/sound-id, prepend tracks/ (mostly for legacy compatibility)
      return '<iframe id="sc-widget" width="100%" height="600" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/'+ id + autoplayQuery +'&amp;hide_related=false&amp;color=373737&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
    },
    link: function(id) {
      return 'https://soundcloud.com/' + id;
    },
    loadAPI: function(apiLoadedCallback) {
      var self = this;
      if(typeof window.SC !== 'undefined') {
        apiLoadedCallback();
        self.activateCurrentPlayer();
        return;
      }
      // docs here: https://developers.soundcloud.com/docs/api/html5-widget#resources
      // and: https://developers.soundcloud.com/blog/html5-widget-api
      embetter.utils.loadRemoteScript("https://w.soundcloud.com/player/api.js");
      // creates an <iframe> (and YouTube player) after the API code downloads.
      var soundcloudApiLoad = setInterval(function() {
        if(typeof window.SC !== 'undefined') {
          window.clearInterval(soundcloudApiLoad);
          apiLoadedCallback();
          self.activateCurrentPlayer();
        }
      }, 50);
    },
    activateCurrentPlayer: function() {
      this.currentIframe = document.querySelector('.embetter-playing[data-soundcloud-id] iframe');
      this.currentIframe.id = document.querySelector('.embetter-playing').getAttribute('data-soundcloud-id'); // set the id on the iframe
      if (this.currentIframe.id) {
        widget = SC.Widget(this.currentIframe);
        widget.bind(SC.Widget.Events.READY, function() {
          widget.bind(SC.Widget.Events.FINISH, function() {
            embetter.utils.mediaComplete();
          });
        });
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // INSTAGRAM
  // http://instagram.com/p/fA9uwTtkSN/media/?size=l
  // https://instagram.com/p/fA9uwTtkSN/embed/
  // http://api.instagram.com/oembed?url=http://instagr.am/p/fA9uwTtkSN/?blah
  /////////////////////////////////////////////////////////////
  embetter.services.instagram = {
    type: 'instagram',
    dataAttribute: 'data-instagram-id',
    regex: embetter.utils.buildRegex('(?:instagram.com|instagr.am)\/p\/([a-zA-Z0-9-_]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://instagram.com/p/'+ id +'/embed/"></iframe>';
    },
    link: function(id) {
      return 'https://instagram.com/p/' + id +'/';
    }
  };


  /////////////////////////////////////////////////////////////
  // DAILYMOTION
  /////////////////////////////////////////////////////////////
  embetter.services.dailymotion = {
    type: 'dailymotion',
    dataAttribute: 'data-dailymotion-id',
    regex: embetter.utils.buildRegex('dailymotion.com\/video\/([a-zA-Z0-9-_]*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '?autoPlay=1' : '';
      return '<iframe class="video" width="'+ w +'" height="'+ h +'" src="//www.dailymotion.com/embed/video/'+ id + autoplayQuery +'" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'http://www.dailymotion.com/video/'+ id;
    }
  };


  /////////////////////////////////////////////////////////////
  // RDIO
  /////////////////////////////////////////////////////////////
  embetter.services.rdio = {
    type: 'rdio',
    dataAttribute: 'data-rdio-id',
    regex: embetter.utils.buildRegex('rdio.com\/(\\S*)'),
    embed: function(id, w, h, autoplay) {
      // var autoplayQuery = (autoplay === true) ? '?autoplay=' : '';
      var autoplayQuery = '';
      return '<iframe width="100%" height="400" src="https://rd.io/i/'+ id + '/' + autoplayQuery +'" frameborder="0" scrolling="no"></iframe>';
    },
    link: function(path) {
      return 'http://www.rdio.com/' + path;
    }
  };


  /////////////////////////////////////////////////////////////
  // MIXCLOUD
  /////////////////////////////////////////////////////////////
  embetter.services.mixcloud = {
    type: 'mixcloud',
    dataAttribute: 'data-mixcloud-id',
    regex: embetter.utils.buildRegex('(?:mixcloud.com)\\/(.*\\/.*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '&amp;autoplay=true' : '';
      return '<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=' + window.escape('http://www.mixcloud.com/' + id) + '&amp;replace=0&amp;hide_cover=1&amp;stylecolor=ffffff&amp;embed_type=widget_standard&amp;'+ autoplayQuery +'" frameborder="0" scrolling="no"></iframe>';
    },
    link: function(id) {
      return 'https://www.mixcloud.com/' + id;
    }
  };


  /////////////////////////////////////////////////////////////
  // CODEPEN
  /////////////////////////////////////////////////////////////
  embetter.services.codepen = {
    type: 'codepen',
    dataAttribute: 'data-codepen-id',
    regex: embetter.utils.buildRegex('(?:codepen.io)\\/([a-zA-Z0-9_\\-%]*\\/[a-zA-Z0-9_\\-%]*\\/[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
     id = id.replace('/pen/', '/embed/');
     var user = id.split('/')[0];
     var slugHash = id.split('/')[2];
     return '<iframe src="//codepen.io/' + id + '?height=' + h + '&amp;theme-id=0&amp;slug-hash=' + slugHash + '&amp;default-tab=result&amp;user=' + user + '" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"></iframe>';
    },
    link: function(id) {
      id = id.replace('/embed/', '/pen/');
      return 'http://codepen.io/' + id;
    }
  };


  /////////////////////////////////////////////////////////////
  // BANDCAMP
  // https://swindleuk.bandcamp.com/album/swindle-walters-call
  // <meta property="twitter:player" content="https://bandcamp.com/EmbeddedPlayer/v=2/album=2659930103/size=large/linkcol=0084B4/notracklist=true/twittercard=true/" />
  // <link rel="image_src" href="https://f1.bcbits.com/img/a0883249002_16.jpg">
  // <meta property="og:image" content="https://f1.bcbits.com/img/a0883249002_16.jpg">
  // <meta property="twitter:player" content="https://bandcamp.com/EmbeddedPlayer/v=2/track=1572756071/size=large/linkcol=0084B4/notracklist=true/twittercard=true/" />
  // <meta property="twitter:image" content="https://f1.bcbits.com/img/a0883249002_2.jpg" />
  // https://f1.bcbits.com/img/a0883249002_16.jpg
  /////////////////////////////////////////////////////////////
  embetter.services.bandcamp = {
    type: 'bandcamp',
    dataAttribute: 'data-bandcamp-id',
    regex: embetter.utils.buildRegex('([a-zA-Z0-9_\\-]*.bandcamp.com\\/(album|track)\\/[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe src="https://bandcamp.com/EmbeddedPlayer/' + id + '/size=large/bgcol=ffffff/linkcol=333333/tracklist=true/artwork=small/transparent=true/" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true" seamless></iframe>';
    },
    link: function(id) {
      return 'https://'+id;
    }
  };


  /////////////////////////////////////////////////////////////
  // USTREAM
  // https://ustream.zendesk.com/entries/52568684-Using-URL-Parameters-and-the-Ustream-Embed-API-for-Custom-Players
  // http://www.ustream.tv/recorded/*
  // http://www.ustream.tv/*
  // http://ustre.am/*
  /////////////////////////////////////////////////////////////
  embetter.services.ustream = {
    type: 'ustream',
    dataAttribute: 'data-ustream-id',
    regex: embetter.utils.buildRegex('(?:ustream.tv|ustre.am)\\/((?:(recorded|channel)\\/)?[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay === true) ? '&amp;autoplay=true' : '';
      return '<iframe width="480" height="300" src="https://www.ustream.tv/embed/' + id + '?v=3&amp;wmode=direct' + autoplayQuery + '" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"></iframe>';
    },
    link: function(id) {
      return 'http://www.ustream.tv/'+id;
    }
  };


  /////////////////////////////////////////////////////////////
  // IMGUR
  // look at this URL: http://imgur.com/gallery/u063r and remove "gallery/" to get a completely different embed
  // http://api.imgur.com/oembed.json?url=http://imgur.com/gallery/u063r
  // look for: <meta name="twitter:card" content="gallery"/> - this lets us prepend "a/" before id to get the gallery embed
  // gallery mode indicator: <meta name="twitter:card" content="gallery"/>
  // gallery embed id: a/u063r
  // gallery embed thumb: first og:image
  // image embed id: u063r
  // image embed thumb: u063r
  /////////////////////////////////////////////////////////////
  embetter.services.imgur = {
    type: 'imgur',
    dataAttribute: 'data-imgur-id',
    regex: embetter.utils.buildRegex('(?:imgur.com)\\/((?:gallery\\/)?[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe width="'+ w +'" height="'+ h +'" src="https://www.imgur.com/'+ id +'/embed" " frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'https://imgur.com/' + id;
    }
  };


  /////////////////////////////////////////////////////////////
  // VINE
  /////////////////////////////////////////////////////////////
  embetter.services.vine = {
    type: 'vine',
    dataAttribute: 'data-vine-id',
    regex: embetter.utils.buildRegex('vine.co\\/v\\/([a-zA-Z0-9-]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe width="'+ w +'" height="'+ h +'" src="https://vine.co/v/'+ id +'/card?mute=1" " frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'https://vine.co/v/' + id;
    }
  };


  /////////////////////////////////////////////////////////////
  // SLIDESHARE
  // http://www.slideshare.net/developers/oembed
  // http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/tedxseoul/the-inaugural-tedxseoul-teaser&format=json
  /////////////////////////////////////////////////////////////
  embetter.services.slideshare = {
    type: 'slideshare',
    dataAttribute: 'data-slideshare-id',
    regex: embetter.utils.buildRegex('slideshare.net\\/([a-zA-Z0-9_\\-%]*\\/[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe width="427" height="356" src="https://www.slideshare.net/slideshow/embed_code/key/'+ id + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    link: function(id) {
      return 'https://www.slideshare.net/' + id;
    }
  };


  /////////////////////////////////////////////////////////////
  // MEDIA PLAYER INSTANCE
  /////////////////////////////////////////////////////////////

  embetter.curPlayer = null;

  embetter.EmbetterPlayer = function(el, serviceObj) {
    this.el = el;
    this.el.classList.add('embetter-ready');
    this.serviceObj = serviceObj;
    this.id = this.el.getAttribute(serviceObj.dataAttribute);
    this.thumbnail = this.el.querySelector('img');
    this.playerEl = null;
    this.buildPlayButton();
    this.checkForBadThumbnail();
  };

  embetter.EmbetterPlayer.prototype.buildPlayButton = function() {
    this.playButton = document.createElement('div');
    this.playButton.classList.add('embetter-loading');
    this.el.appendChild(this.playButton);

    this.playButton = document.createElement('div');
    this.playButton.classList.add('embetter-play-button');
    this.el.appendChild(this.playButton);

    var self = this;
    this.playHandler = function() { self.play(); }; // for event listener removal
    this.playButton.addEventListener('click', this.playHandler);
  };

  embetter.EmbetterPlayer.prototype.checkForBadThumbnail = function() {
    var self = this;
    // try to detect onerror
    this.thumbnail.onerror = function() {
      self.fallbackThumbnail();
    };
    // if onerror already happened but we still have a broken image, give it 4 seconds to load, then replace
    setTimeout(function() {
      if(self.thumbnail.height < 50) {
        self.fallbackThumbnail();
      }
    }, 4000);
  };

  embetter.EmbetterPlayer.prototype.fallbackThumbnail = function() {
    this.thumbnail.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGcAQMAAAABMOGrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURQAAAKd6PdoAAAA6SURBVHja7cGBAAAAAMOg+VPf4ARVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAN488AAGP4e1mAAAAAElFTkSuQmCC';
  };

  embetter.EmbetterPlayer.prototype.getType = function() {
    return this.serviceObj.type;
  };

  embetter.EmbetterPlayer.prototype.play = function() {
    if(embetter.curPlayer != null) {
      embetter.curPlayer.unembedMedia();
      embetter.curPlayer = null;
    }

    var self = this;
    var startPlaying = function() {
      self.embedMedia(true);
      embetter.curPlayer = self;
    };
    // load API if one exists for service, otherwise just play
    if(this.serviceObj.loadAPI && embetter.apiEnabled === true && embetter.utils.isMobile === false) {
      this.serviceObj.loadAPI(startPlaying);
    } else {
      startPlaying();
    }
  };

  embetter.EmbetterPlayer.prototype.unembedMedia = function() {
    if(this.playerEl != null && this.playerEl.parentNode != null) {
      this.playerEl.parentNode.removeChild(this.playerEl);
    }
    this.el.classList.remove('embetter-playing');
  };

  // embed if mobile
  embetter.EmbetterPlayer.prototype.embedMedia = function(autoplay) {
    if(this.el.classList.contains('embetter-playing') === true) return;
    if(this.id != null) this.playerEl = embetter.utils.stringToDomElement(this.serviceObj.embed(this.id, this.thumbnail.width, this.thumbnail.height, autoplay));
    this.el.appendChild(this.playerEl);
    this.el.classList.add('embetter-playing');
  };

  embetter.EmbetterPlayer.prototype.dispose = function() {
    this.el.classList.remove('embetter-ready');
    this.unembedMedia();
    this.playButton.removeEventListener('click', this.playHandler);
    if(this.playButton != null && this.playButton.parentNode != null) {
      this.playButton.parentNode.removeChild(this.playButton);
    }
  };
})();
