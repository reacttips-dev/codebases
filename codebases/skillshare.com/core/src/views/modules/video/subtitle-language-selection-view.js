import Mustache from 'mustache';

import template from 'text!core/src/templates/modules/video/subtitle-language-selection-view.mustache';
import SubtitlesState from '../../../models/video/subtitles-state';

const SubtitleLanguageSelectionView = Backbone.View.extend({
    template,
    className: 'subtitle-language-selection-view',
    container: null,
    anchor: null,

    initialize: function(options = {}) {
        this.container = options.container;
        this.anchor = options.anchor;

        this._setupBindings();
        this._setupView();
    },

    render: function() {
        if (this.model.get('isSelectingLanguage')) {  
            this._updateViewPosition();      
            this.$el.show();
        } else {
            this.$el.hide();
        }
        return this;
    },

    _updateViewPosition: function() {
        const anchorPosition = this.anchor.position();
        const anchorWidth = this.anchor.width();
        const containerHeight = this.container.height();
        const bottomOffset = 10;

        const anchorCenterX = anchorPosition.left + anchorWidth/2.0;
        const containerOffset = SubtitleLanguageSelectionView.MENU_WIDTH/2.0;
        const leftPosition = anchorCenterX - containerOffset;
        const bottomPosition = containerHeight + bottomOffset;
        
        this.$el.css({
            left: `${leftPosition}px`,
            bottom: `${bottomPosition}px`,
        });
    },

    _setupBindings: function() {
        this.listenTo(this.model, "change:isSelectingLanguage", this.render);
        this.listenTo(this.model, "change:languageOptions", this._populateLanguageOptionsList);
        this.listenTo(this.model, "change:selectedLanguage", this._selectCorrectListItem);

        $(window).on('resize', _.debounce(() => {
            this.$el.hide();
        }, 100));
    },

    _setupView: function() {
        this.container.append(this.$el);

        this.$el.css({
            'width': `${SubtitleLanguageSelectionView.MENU_WIDTH}px`,
        })

        this._populateLanguageOptionsList();
    },

    _populateLanguageOptionsList: function() {
      this.$el.html(
          Mustache.render(
            this.template,
            this._getLanguageOptionsForRender(),
          )
      );

      this._bindListItemLinks();
      this.render();
    },

    _selectCorrectListItem: function () {
      const { id } = this.model.get('selectedLanguage');
      const dataLanguageId = (!id || id === SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE) ? SubtitleLanguageSelectionView.LANGUAGE_ITEM_OFF_ID : id;

      this.$el.find(`.list-item`).removeClass('selected');
      this.$el.find(`.list-item .list-item-link[data-language-id=${dataLanguageId}]`).parent().addClass('selected');
    },

    _bindListItemLinks: function() {
        this.$el.find('.list-item-link').on('click', (event) => {
            const { languageId } = event.currentTarget.dataset;
            this._handleSelection(
                languageId,
            );
        });

        this.$el.find('.list-item-link').on('touchend', (event) => {
            event.preventDefault();
            const { languageId } = event.currentTarget.dataset;
            this._handleSelection(
                languageId,
                true
            );
        });
    },

    _handleSelection: function(languageId, hideOnSelect = false) {
      const source = SubtitlesState.LANGUAGE_SOURCE_COOKIE;
      
      if (languageId === SubtitleLanguageSelectionView.LANGUAGE_ITEM_OFF_ID) {
          this.model.setSelectedLanguageAndTrack(SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE, source);
      } else {
          this.model.setSelectedLanguageAndTrack(languageId, source);
      }

      if (hideOnSelect) {
          this.$el.hide();
      }
    },

    // Format the raw language options data for display
    _getLanguageOptionsForRender: function() {
        const selectedLanguageId = this.model.get('selectedLanguage').id;

        // Prepend the OFF option to the front of the list
        const languageOptions = [
          {
            id: SubtitleLanguageSelectionView.LANGUAGE_ITEM_OFF_ID,
            label: "Subtitles Off"
          },
          ...this.model.get('languageOptions')
        ];

        return {
          languageOptions: languageOptions.map(language => {
              const languageIsOff = language.id === SubtitleLanguageSelectionView.LANGUAGE_ITEM_OFF_ID;
              let isSelected = false;

              if (languageIsOff && (!selectedLanguageId || selectedLanguageId === SubtitlesState.COOKIE_SUBTITLES_SELECTED_OFF_VALUE)) {
                isSelected = true;
              } else {
                isSelected = this.model.isLanguageMatch(language.id, selectedLanguageId);
              }
              
              return {
                ...language,
                isSelected: isSelected ? "selected" : "",
              };
          }),
        };
    }

}, {
    MENU_WIDTH: 150,
    INNER_PADDING: 20,
    LANGUAGE_ITEM_OFF_ID: "__language_id_off__"
});

export default SubtitleLanguageSelectionView;
