// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const CC_License = 'http://creativecommons.org/licenses/by/2.0/deed.en';

const BACKGROUNDPACKS = {
  unsplash: {
    name: 'Unsplash',
  },

  photos: {
    name: 'Photos',
  },

  patterns: {
    name: 'Patterns and Textures',
  },
};

module.exports.Backgrounds = {
  blue: {
    type: 'default',
    brightness: 'dark',
    color: '#0079BF',
  },

  orange: {
    type: 'default',
    brightness: 'dark',
    color: '#D29034',
  },

  green: {
    type: 'default',
    brightness: 'dark',
    color: '#519839',
  },

  red: {
    type: 'default',
    brightness: 'dark',
    color: '#B04632',
  },

  purple: {
    type: 'default',
    brightness: 'dark',
    color: '#89609E',
  },

  pink: {
    type: 'default',
    brightness: 'dark',
    color: '#CD5A91',
  },

  lime: {
    type: 'default',
    brightness: 'dark',
    color: '#4BBF6B',
  },

  sky: {
    type: 'default',
    brightness: 'dark',
    color: '#00AECC',
  },

  grey: {
    type: 'default',
    brightness: 'dark',
    color: '#838C91',
  },

  // Gradients

  'gradient-snow': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-snow.svg'),
    color: '#009ED0',
    emoji: '❄️',
  },

  'gradient-ocean': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-ocean.svg'),
    color: '#054C81',
    emoji: '🌊',
  },

  'gradient-crystal': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-crystal.svg'),
    color: '#792D7D',
    emoji: '🔮',
  },

  'gradient-rainbow': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-rainbow.svg'),
    color: '#AF78CE',
    emoji: '🌈',
  },

  'gradient-peach': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-peach.svg'),
    color: '#EB5B7E',
    emoji: '🍑',
  },

  'gradient-flower': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-flower.svg'),
    color: '#CA80A5',
    emoji: '🌸',
  },

  'gradient-earth': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-earth.svg'),
    color: '#29A383',
    emoji: '🌎',
  },

  'gradient-alien': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-alien.svg'),
    color: '#344563',
    emoji: '👽',
  },

  'gradient-volcano': {
    type: 'gradient',
    path: require('resources/images/gradients/gradient-volcano.svg'),
    color: '#6B474B',
    emoji: '🌋',
  },

  // Photos

  mountain: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'light',
    fullSizeUrl: require('resources/images/backgrounds/mountain/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1696,
        url: require('resources/images/backgrounds/mountain/large.jpg'),
      },
      {
        width: 1024,
        height: 724,
        url: require('resources/images/backgrounds/mountain/medium.jpg'),
      },
      {
        width: 320,
        height: 227,
        url: require('resources/images/backgrounds/mountain/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/62681247@N00/6575973407/',
      name: 'jqmj (Queralt)',
      license: CC_License,
    },
  },

  cosmos: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/cosmos/full.jpg'),
    scaled: [
      {
        width: 2047,
        height: 1638,
        url: require('resources/images/backgrounds/cosmos/large.jpg'),
      },
      {
        width: 1600,
        height: 1280,
        url: require('resources/images/backgrounds/cosmos/medium.jpg'),
      },
      {
        width: 320,
        height: 256,
        url: require('resources/images/backgrounds/cosmos/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/gsfc/6945160410/',
      name: 'NASA Goddard Space Flight Center',
      license: CC_License,
    },
  },

  rain: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/rain/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/rain/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/rain/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/rain/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/vinothchandar/5243641910/',
      name: 'Vinoth Chandar',
      license: CC_License,
    },
  },

  dew: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'light',
    fullSizeUrl: require('resources/images/backgrounds/dew/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: require('resources/images/backgrounds/dew/large.jpg'),
      },
      {
        width: 1024,
        height: 680,
        url: require('resources/images/backgrounds/dew/medium.jpg'),
      },
      {
        width: 320,
        height: 212,
        url: require('resources/images/backgrounds/dew/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/jenny-pics/5584430423/',
      name: 'Jenny Downing',
      license: CC_License,
    },
  },

  'snow-bokeh': {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/snow-bokeh/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/snow-bokeh/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/snow-bokeh/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/snow-bokeh/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/tabor-roeder/5337595458/',
      name: 'Phil Roeder',
      license: CC_License,
    },
  },

  city: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/city/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: require('resources/images/backgrounds/city/large.jpg'),
      },
      {
        width: 1024,
        height: 680,
        url: require('resources/images/backgrounds/city/medium.jpg'),
      },
      {
        width: 320,
        height: 212,
        url: require('resources/images/backgrounds/city/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/nosha/2907855809/',
      name: 'Nathan Siemers',
      license: CC_License,
    },
  },

  canyon: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'light',
    fullSizeUrl: require('resources/images/backgrounds/canyon/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/canyon/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/canyon/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/canyon/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/wolfgangstaudt/2252688630/',
      name: 'Wolfgang Staudt',
      license: CC_License,
    },
  },

  ocean: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/ocean/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/ocean/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/ocean/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/ocean/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/mattphipps/4635112852/',
      name: 'MattJP',
      license: CC_License,
    },
  },

  river: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/river/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/river/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/river/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/river/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/22746515@N02/3114276532/',
      name: 'Bert Kaufmann',
      license: CC_License,
    },
  },

  fall: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    discontinued: true,
    fullSizeUrl: require('resources/images/backgrounds/fall/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/fall/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/fall/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/fall/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/mendhak/4107993637/',
      name: 'mendhak',
      license: CC_License,
    },
  },

  snow: {
    type: 'premium',
    pack: BACKGROUNDPACKS['photos'],
    discontinued: true,
    fullSizeUrl: require('resources/images/backgrounds/snow/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/snow/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/snow/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/snow/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/zachd1_618/5386165480/',
      name: 'Zach Dischner',
      license: CC_License,
    },
  },

  // Patterns and textures

  purty_wood_dark: {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/purty_wood_dark.png'),
    attribution: {
      url: 'http://subtlepatterns.com/purty-wood/',
      name: 'Richard Tabor',
      license: CC_License,
    },
  },

  'subtle-irongrip': {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/subtle-irongrip.png'),
    attribution: {
      url: 'http://subtlepatterns.com/iron-grip/',
      name: 'Tony Kinard',
      license: CC_License,
    },
  },

  'red-sweater': {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/red-sweater.png'),
    attribution: {
      url: 'http://subtlepatterns.com/wild-oliva/',
      name: 'Badhon Ebrahim',
      license: CC_License,
    },
  },

  hex: {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/hex.png'),
  },

  wave: {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/wave.png'),
  },

  bricks: {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    tile: true,
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/bricks.png'),
  },

  'purple-blur': {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/purple-blur.png'),
  },

  'orange-blur': {
    type: 'premium',
    pack: BACKGROUNDPACKS['patterns'],
    brightness: 'dark',
    fullSizeUrl: require('resources/images/backgrounds/orange-blur.png'),
  },
};
