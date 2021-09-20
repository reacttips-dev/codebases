/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  EmojiProviderComponent,
} = require('app/src/components/Emoji/EmojiProviderComponent');
const NimblePicker = require('emoji-mart/dist-es/components/picker/nimble-picker')
  .default;
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('reactions');
const tx = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_emoji_uploader',
);
const _ = require('underscore');
const { Button } = require('@trello/nachos/button');

class TrelloEmojiPicker extends React.Component {
  static initClass() {
    this.defaultProps = {
      title: '',
      emoji: '',
      color: '#0079BF',
      set: 'twitter',
      i18n: {
        search: t.l('search'),
        notfound: t.l('no-emoji-found'),
        skintext: t.l('skintext'),
        categories: {
          search: t.l('categories-search-results'),
          recent: t.l('categories-frequently-used'),
          people: t.l('categories-smileys-and-people').replace(/&amp;/g, '&'), //escaped ampersands are not handled by emojimart
          nature: t.l('categories-animals-and-nature').replace(/&amp;/g, '&'),
          foods: t.l('categories-food-and-drink').replace(/&amp;/g, '&'),
          activity: t.l('categories-activity'),
          places: t.l('categories-travel-and-places').replace(/&amp;/g, '&'),
          objects: t.l('categories-objects'),
          symbols: t.l('categories-symbols'),
          flags: t.l('categories-flags'),
          custom: t.l('categories-custom'),
        },
      },
      style: { width: '408px' },
      emojiSize: '28px',
      skinEmoji: 'v',
      autoFocus: true,
      showCustomEmojiButton: false,
    };
  }

  componentDidMount() {
    return (document.querySelector('#chrome-container').scrollTop = 0);
  }

  render() {
    const notFound = () => {
      return (
        <div className="emoji-mart-no-results">
          <div className="emoji-mart-no-results-illo">
            <div className="emoji-mart-no-results-label">
              {t.l('no-emoji-found')}
            </div>
            <img
              className="emoji-mart-no-results-img"
              src={require('resources/images/illos.png')}
            />
          </div>
          {this.props.showCustomEmojiButton && (
            <div className="emoji-mart-no-results-btn">
              <Button onClick={this.props.onCustomEmojiButtonClick}>
                {tx.l('create-custom-emoji')}
              </Button>
            </div>
          )}
        </div>
      );
    };
    // Prevents the notifications popover from closing
    return (
      <div
        onClick={function (e) {
          return e.preventDefault();
        }}
      >
        <EmojiProviderComponent>
          {(data, backgroundImageFn) => {
            return (
              <NimblePicker
                ref={(node) => {
                  this.pickerRef = node;
                }}
                {..._.extend({}, this.props, {
                  data,
                  backgroundImageFn,
                  notFound,
                })}
              />
            );
          }}
        </EmojiProviderComponent>
      </div>
    );
  }
}

TrelloEmojiPicker.initClass();
module.exports = TrelloEmojiPicker;
