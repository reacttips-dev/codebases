import PropTypes from 'prop-types';

var EmojiPropTypes = {
  data: PropTypes.object.isRequired,
  onOver: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func,
  fallback: PropTypes.func,
  backgroundImageFn: PropTypes.func,
  native: PropTypes.bool,
  forceSize: PropTypes.bool,
  tooltip: PropTypes.bool,
  skin: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  sheetSize: PropTypes.oneOf([16, 20, 32, 64]),
  sheetColumns: PropTypes.number,
  sheetRows: PropTypes.number,
  set: PropTypes.oneOf(['apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook']),
  size: PropTypes.number.isRequired,
  emoji: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

var EmojiDefaultProps = {
  skin: 1,
  set: 'apple',
  sheetSize: 64,
  sheetColumns: 52,
  sheetRows: 52,
  native: false,
  forceSize: false,
  tooltip: false,
  backgroundImageFn: function backgroundImageFn(set, sheetSize) {
    return 'https://unpkg.com/emoji-datasource-' + set + '@' + '4.0.4' + '/img/' + set + '/sheets-256/' + sheetSize + '.png';
  },
  onOver: function onOver() {},
  onLeave: function onLeave() {},
  onClick: function onClick() {}
};

var PickerPropTypes = {
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onSkinChange: PropTypes.func,
  perLine: PropTypes.number,
  emojiSize: PropTypes.number,
  i18n: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  emoji: PropTypes.string,
  color: PropTypes.string,
  set: EmojiPropTypes.set,
  skin: EmojiPropTypes.skin,
  native: PropTypes.bool,
  backgroundImageFn: EmojiPropTypes.backgroundImageFn,
  sheetSize: EmojiPropTypes.sheetSize,
  emojisToShowFilter: PropTypes.func,
  showPreview: PropTypes.bool,
  showSkinTones: PropTypes.bool,
  emojiTooltip: EmojiPropTypes.tooltip,
  include: PropTypes.arrayOf(PropTypes.string),
  exclude: PropTypes.arrayOf(PropTypes.string),
  recent: PropTypes.arrayOf(PropTypes.string),
  autoFocus: PropTypes.bool,
  custom: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    short_names: PropTypes.arrayOf(PropTypes.string).isRequired,
    emoticons: PropTypes.arrayOf(PropTypes.string),
    keywords: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string.isRequired
  })),
  skinEmoji: PropTypes.string,
  notFound: PropTypes.func,
  notFoundEmoji: PropTypes.string,
  icons: PropTypes.object
};

var PickerDefaultProps = {
  onClick: function onClick() {},
  onSelect: function onSelect() {},
  onSkinChange: function onSkinChange() {},
  emojiSize: 24,
  perLine: 9,
  i18n: {},
  style: {},
  title: 'Emoji Mart™',
  emoji: 'department_store',
  color: '#ae65c5',
  set: EmojiDefaultProps.set,
  skin: null,
  defaultSkin: EmojiDefaultProps.skin,
  native: EmojiDefaultProps.native,
  sheetSize: EmojiDefaultProps.sheetSize,
  backgroundImageFn: EmojiDefaultProps.backgroundImageFn,
  emojisToShowFilter: null,
  showPreview: true,
  showSkinTones: true,
  emojiTooltip: EmojiDefaultProps.tooltip,
  autoFocus: false,
  custom: [],
  skinEmoji: '',
  notFound: function notFound() {},
  notFoundEmoji: 'sleuth_or_spy',
  icons: {}
};

export { EmojiPropTypes, EmojiDefaultProps, PickerPropTypes, PickerDefaultProps };