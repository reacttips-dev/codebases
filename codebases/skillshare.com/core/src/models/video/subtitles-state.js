import {
  isMultiLanguageSubtitlesEnabled,
  shouldTurnOnCaptionsByDefault
} from 'core/src/views/modules/flags';

const SubtitlesState = Backbone.Model.extend({
  defaults: {
    selectedLanguage: {id: undefined, source: undefined},
    isSelectingLanguage: false, // Used to open and close the list of language options in the UI
    languageOptions: [],
  },
  
  initialize: function() {   
    const cookieValue = this.getCookieValue();
    
    this.once('change:languageOptions', this.migrateOldCookieIfNecessary);
    this.on('change:selectedLanguage', this.syncCookieValue);
    
    /**
    * Set selectedLanguageId based on cookie value
    */
    if (typeof cookieValue === 'undefined') {
      if (shouldTurnOnCaptionsByDefault() && isMultiLanguageSubtitlesEnabled()) {
        this.once('change:languageOptions', this.setRecommendedLanguage);
      } else {
        const language = {id: undefined, source: SubtitlesState.LANGUAGE_SOURCE_NONE};
        this.set('selectedLanguage', language);
      }
    } else {
      this.once('change:languageOptions', () => {
        this.setLanguageFromCookieValue(cookieValue);
      });
    }
  },
  
  setLanguageFromCookieValue: function(cookieValue) {
    if (cookieValue === SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE) {
      const language = {id: cookieValue, source: SubtitlesState.LANGUAGE_SOURCE_COOKIE};
      this.set('selectedLanguage', language);
    } else {
      const match = this.get('languageOptions').find(({id}) => {
        return this.isLanguageMatch(id, cookieValue);        
      });

      if (match) {
        const language = {id: cookieValue, source: SubtitlesState.LANGUAGE_SOURCE_COOKIE};
        this.set('selectedLanguage', language);
      } else {
        /**
        * Language was previously selected by the user but
        * it is not present in the current available list.
        * For this case using the recommended one.
        */      
        this.setRecommendedLanguage();
      }
    }
  },

  setRecommendedLanguage: function() {
    const languageOptions = this.get('languageOptions').map(({id}) => id).filter(this.isNotEnglish.bind(this));

    const { languages: defaultBrowserLanguages } = window.navigator;
    const deviceMatch = this.findFirstLanguageMatch(languageOptions, defaultBrowserLanguages);

    if (deviceMatch && deviceMatch.length > 0) {
      const language = {id: deviceMatch, source: SubtitlesState.LANGUAGE_SOURCE_DEVICE};
      this.set('selectedLanguage', language);
      return;
    }

    const suggestedLanguageCode = SS.serverBootstrap?.clientContext?.suggestedLanguageCode;
    const serverLanguages = suggestedLanguageCode ? [suggestedLanguageCode] : [];
    const serverMatch = this.findFirstLanguageMatch(languageOptions, serverLanguages);

    if (serverMatch && serverMatch.length > 0) {
      const language = {id: serverMatch, source: SubtitlesState.LANGUAGE_SOURCE_SERVER};
      this.set('selectedLanguage', language);
      return;
    }

    const language = {id: undefined, source: SubtitlesState.LANGUAGE_SOURCE_NONE};
    this.set('selectedLanguage', language);
  },

  setSelectedLanguageAndTrack: function(id, source) {
    const oldId = this.get('selectedLanguage').id;
    
    if(oldId !== id) {
      this.set('selectedLanguage', {id: id, source: source});
      this.trigger('trackSelectedLanguageChange', { 
        oldId, 
        id, 
        isMultiLanguageSubtitlesEnabled: isMultiLanguageSubtitlesEnabled()
      });
    }
  },
  
  toggleOrSelect: function() {
    if (isMultiLanguageSubtitlesEnabled()) {
      /**
      * If there's more than one language option, show the subtitles list UI,
      * otherwise toggle the only option on/off
      */
      if (!this.isLanguageOptionsEmpty() && !this.isSingleLanguageOption()) {
        this.set('isSelectingLanguage', !this.get('isSelectingLanguage'));
      } else {
        this.toggleOnOffState();
      }
    } else {
      this.toggleOnOffState();
    }
  },
  
  toggleOnOffState: function() {
    const languageOptions = this.get('languageOptions');
    const selectionSource = SubtitlesState.LANGUAGE_SOURCE_COOKIE;
    
    if (this.languageIsSelected()) { 
      
      this.setSelectedLanguageAndTrack(SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE, selectionSource);
    } else {
      const defaultLanguageId = this.getDefaultLanguageOption();
      
      if (defaultLanguageId) {
        this.setSelectedLanguageAndTrack(defaultLanguageId, selectionSource);  
      } else if(languageOptions) {
        // If a default option cannot be found, fallback to the first option
        this.setSelectedLanguageAndTrack(languageOptions[0].id, selectionSource);  
      }
    }
  },

  isLanguageMatch: function(a, b) {
    if (!a || !b) { return false; }

    function getSimpleLanguageId(language) {
      return language.split('-')[0];
    }

    return getSimpleLanguageId(a) === getSimpleLanguageId(b);
  },

 /// Currently the default option comes from BrightCove
  getDefaultLanguageOption: function() {
    const languageOptions = this.get('languageOptions');
    const option = languageOptions.find(({isDefault}) => isDefault);

    return option ? option.id : undefined;
  },

  isEnglish: function(language) {
    return this.isLanguageMatch(language, SubtitlesState.LANGUAGES.ENGLISH);
  },
  
  isNotEnglish: function(language) {
    return !this.isEnglish(language);
  },
  
  languageIsSelected: function() {
    const id = this.get('selectedLanguage').id;
    const options = this.get('languageOptions');

    if (!id || !options.length) {
      return false;
    } else if (id === SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE) {
      return false;
    }

    const match = options.find((option) => {
      return this.isLanguageMatch(id, option.id);        
    });

    return match !== undefined;
  },
  
  isSingleLanguageOption: function() {
    return this.get('languageOptions').length === 1;
  },
  
  isLanguageOptionsEmpty: function() {
    return this.get('languageOptions').length === 0;
  },

  syncCookieValue: function() {
    const id = this.get('selectedLanguage').id;
    const source = this.get('selectedLanguage').source;

    if (source !== SubtitlesState.LANGUAGE_SOURCE_COOKIE) {
      return;
    }

    if (!id) {
      this.removeCookie();
    } else if (id === SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE) {
      this.setCookieValue(SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE);
    } else {
      this.setCookieValue(id);
    }
  },

  getCookieValue: function() {
    return $.cookie(SubtitlesState.COOKIE_SUBTITLES_SELECTED_LANGUAGE_ID);
  },

  setCookieValue: function(value) {
    $.cookie(SubtitlesState.COOKIE_SUBTITLES_SELECTED_LANGUAGE_ID, value, { path: '/' });
  },

  removeCookie: function() {
    $.removeCookie(SubtitlesState.COOKIE_SUBTITLES_SELECTED_LANGUAGE_ID, { path: '/' });
  },
  
  migrateOldCookieIfNecessary: function() {
    const oldCookieValue = $.cookie(SubtitlesState.COOKIE_LEGACY_CAPTIONS_STATE_NAME);
    
    if(typeof oldCookieValue === 'undefined') {
      return; // Nothing to migrate
    }

    if (oldCookieValue !== SubtitlesState.COOKIE_LEGACY_CAPTIONS_STATE_OFF) {
      const defaultLanguageId = this.getDefaultLanguageOption();

      const language = {id: defaultLanguageId, source: SubtitlesState.LANGUAGE_SOURCE_COOKIE};
      this.set('selectedLanguage', language);
    }
    
    // Migration is done. Deleting legacy cookie!
    $.removeCookie(SubtitlesState.COOKIE_LEGACY_CAPTIONS_STATE_NAME, { path: '/' });
  },

  //The O(n^2) is fine for now (and probably forever) 
  //bc we're working with small datasets.
  findFirstLanguageMatch: function(options, matches) {
    return options.find((option) => {
      return matches.find((match) => {
        return this.isLanguageMatch(match, option); 
      })        
    });
  }
}, {
  
  COOKIE_LEGACY_CAPTIONS_STATE_NAME: 'CAPTIONS',
  COOKIE_LEGACY_CAPTIONS_STATE_OFF: 'off',
  COOKIE_SUBTITLES_SELECTED_LANGUAGE_ID: "subtitles_selected_language_id",
  COOKIE_SUBTITLES_SELECTED_OFF_VALUE: "off",
  LANGUAGES: { ENGLISH: 'en' },
  LANGUAGE_SOURCE_COOKIE: "cookie",
  LANGUAGE_SOURCE_DEVICE: "device",
  LANGUAGE_SOURCE_SERVER: "server",
  LANGUAGE_SOURCE_NONE: "none"
});

export default SubtitlesState;
